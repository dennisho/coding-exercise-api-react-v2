<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PeopleGroupsController extends Controller
{
    /**
     * Display a listing of the resource.
     *{"data":[]}
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $groups = DB::select('select * from breeze.`groups` inner join breeze.people on breeze.people.group_id = breeze.`groups`.id where breeze.people.status = \'active\' order by group_name, first_name, last_name', [1]);

        $jobj = array("data"=>[]);

        if (count($groups) > 0) {
            //echo $groups[0]->group_name . '<br>';
            $preGroups = $groups[0]->group_name;
            $personArr = array();
            $dataArr = array();
            foreach($groups as $group){
                //echo $group->group_name;
                if($preGroups !== $group->group_name){
                    $groupArr = array("group_name" => $preGroups, "people" => $personArr);
                    array_push($dataArr,$groupArr);
                    $personArr = array();
                }
                $tempPerson = array("first_name" => $group->first_name, "last_name" => $group->last_name, "email_address" => $group->email_address);
                array_push($personArr,$tempPerson);
                
                $preGroups = $group->group_name;
            }

            $groupArr = array("group_name" => $preGroups, "people" => $personArr);
            array_push($dataArr,$groupArr);
            
            $jobj = array("data"=> $dataArr);
        }
       // echo json_encode($dataArr);

        $retJSON = json_encode($jobj);

        return $retJSON;
    }

}
