import { randomUUID } from 'node:crypto';
import { firestore } from '../firestore.js';

const defaultDb = {
  users: [],
  subjects: [],
  students: [],
  faculties: [],
  courses: [],
  grades: [],
  schedules: [],
  events: [],
  research: [],
  announcements: [],
  disciplineRecords: [],
  messages: [],
  syllabi: [],
};

let writeQueue = Promise.resolve();

const clone = (value) => JSON.parse(JSON.stringify(value));
const collectionKeys = Object.keys(defaultDb);

const commitBatch = async (operations) => {
  if (operations.length === 0) return;

  const MAX_BATCH_SIZE = 450;
  for (let index = 0; index < operations.length; index += MAX_BATCH_SIZE) {
    const slice = operations.slice(index, index + MAX_BATCH_SIZE);
    const batch = firestore.batch();

    for (const op of slice) {
      if (op.type === 'set') {
        batch.set(op.ref, op.data, { merge: false });
      } else if (op.type === 'delete') {
        batch.delete(op.ref);
      }
    }

    await batch.commit();
  }
};

export const loadDb = async () => {
  const db = clone(defaultDb);

  await Promise.all(
    collectionKeys.map(async (key) => {
      const snapshot = await firestore.collection(key).get();
      db[key] = snapshot.docs.map((documentSnapshot) => ({
        ...documentSnapshot.data(),
        id: documentSnapshot.id,
      }));
    })
  );

  return db;
};

export const nowIso = () => new Date().toISOString();

export const normalizeRecord = (record) => ({
  ...record,
  created_at: record.created_at ?? record.createdAt ?? null,
  updated_at: record.updated_at ?? record.updatedAt ?? null,
  createdAt: record.createdAt ?? record.created_at ?? null,
  updatedAt: record.updatedAt ?? record.updated_at ?? null,
});

const toCollectionKey = (collectionName) => {
  if (collectionName === 'discipline-records') return 'disciplineRecords';
  return collectionName;
};

const isCollectionAllowed = (collectionName) =>
  [
    'users',
    'subjects',
    'students',
    'faculties',
    'courses',
    'grades',
    'schedules',
    'events',
    'research',
    'announcements',
    'syllabi',
    'disciplineRecords',
  ].includes(collectionName);

export const saveDb = async (db) => {
  const operations = [];

  for (const key of collectionKeys) {
    const collectionRef = firestore.collection(key);
    const currentSnapshot = await collectionRef.get();
    const nextRecords = (db[key] ?? []).map((record) => normalizeRecord(record));
    const nextIds = new Set();

    for (const record of nextRecords) {
      const idCandidate = String(record.id ?? '').trim();
      const id = idCandidate.length > 0 ? idCandidate : randomUUID();
      nextIds.add(id);
      operations.push({
        type: 'set',
        ref: collectionRef.doc(id),
        data: {
          ...record,
          id,
        },
      });
    }

    for (const existing of currentSnapshot.docs) {
      if (!nextIds.has(existing.id)) {
        operations.push({
          type: 'delete',
          ref: existing.ref,
        });
      }
    }
  }

  await commitBatch(operations);
};

export const withWriteLock = (operation) => {
  const next = writeQueue.then(operation, operation);
  writeQueue = next.then(() => undefined, () => undefined);
  return next;
};

export const getAll = async (collectionName) => {
  const db = await loadDb();
  const key = toCollectionKey(collectionName);
  if (!isCollectionAllowed(key)) {
    return null;
  }
  return (db[key] ?? []).map(normalizeRecord);
};

export const getById = async (collectionName, id) => {
  const records = await getAll(collectionName);
  if (!records) return null;
  return records.find((record) => String(record.id) === String(id)) ?? null;
};

export const query = async (collectionName, filters) => {
  const records = await getAll(collectionName);
  if (!records) return null;
  return records.filter((record) =>
    Object.entries(filters).every(([field, value]) => String(record[field] ?? '') === String(value))
  );
};

export const createRecord = async (collectionName, data) =>
  withWriteLock(async () => {
    const db = await loadDb();
    const key = toCollectionKey(collectionName);
    if (!isCollectionAllowed(key)) {
      return null;
    }

    const timestamp = nowIso();
    const record = normalizeRecord({
      id: randomUUID(),
      ...data,
      created_at: timestamp,
      updated_at: timestamp,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    db[key] = [...(db[key] ?? []), record];
    await saveDb(db);
    return record;
  });

export const updateRecord = async (collectionName, id, data) =>
  withWriteLock(async () => {
    const db = await loadDb();
    const key = toCollectionKey(collectionName);
    if (!isCollectionAllowed(key)) {
      return null;
    }

    const records = db[key] ?? [];
    const index = records.findIndex((record) => String(record.id) === String(id));

    const timestamp = nowIso();
    if (index === -1) {
      const created = normalizeRecord({
        id,
        ...data,
        created_at: timestamp,
        createdAt: timestamp,
        updated_at: timestamp,
        updatedAt: timestamp,
      });

      db[key] = [...records, created];
      await saveDb(db);
      return created;
    }

    const existing = records[index];
    const updated = normalizeRecord({
      ...existing,
      ...data,
      id: existing.id,
      created_at: existing.created_at ?? existing.createdAt ?? timestamp,
      createdAt: existing.createdAt ?? existing.created_at ?? timestamp,
      updated_at: timestamp,
      updatedAt: timestamp,
    });

    records[index] = updated;
    db[key] = records;
    await saveDb(db);
    return updated;
  });

export const deleteRecord = async (collectionName, id) =>
  withWriteLock(async () => {
    const db = await loadDb();
    const key = toCollectionKey(collectionName);
    if (!isCollectionAllowed(key)) {
      return false;
    }

    const records = db[key] ?? [];
    const nextRecords = records.filter((record) => String(record.id) !== String(id));
    if (nextRecords.length === records.length) return false;

    db[key] = nextRecords;
    await saveDb(db);
    return true;
  });
