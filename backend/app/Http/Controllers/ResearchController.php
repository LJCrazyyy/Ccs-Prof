<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Kreait\Firebase\Database;

class ResearchController extends Controller
{
    protected $database;
    protected $researchRef;

    public function __construct(Database $database)
    {
        $this->database = $database;
        $this->researchRef = $this->database->getReference('research');
    }

    // 1. Show all research
    public function index()
    {
        $research = $this->researchRef->getValue() ?? [];
        return response()->json($research);
    }

    // 2. Approve research
    public function approve($id)
    {
        $this->researchRef->getChild($id)->update(['approved' => true]);
        return response()->json(['message' => 'Research approved']);
    }

    // 3. Change status
    public function changeStatus(Request $request, $id)
    {
        $status = $request->input('status');
        $this->researchRef->getChild($id)->update(['status' => $status]);
        return response()->json(['message' => 'Status updated']);
    }

    // 4. Assign to panels
    public function assignPanels(Request $request, $id)
    {
        $panelIds = $request->input('panel_ids', []);
        $this->researchRef->getChild($id)->update(['panel_ids' => $panelIds]);
        return response()->json(['message' => 'Panels assigned']);
    }

    // 5. Assign to faculty for advisers
    public function assignAdviser(Request $request, $id)
    {
        $adviserId = $request->input('adviser_id');
        $this->researchRef->getChild($id)->update(['adviser_id' => $adviserId]);
        return response()->json(['message' => 'Adviser assigned']);
    }
}
