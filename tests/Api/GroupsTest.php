<?php

namespace Tests\Api;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\Group;

class GroupsControllerTest extends TestCase
{
    use WithFaker;

    public function testGroupCreated()
    {
        $expected = [
            'group_name' => 'Fellowship of the Ring'
        ];
        $response = $this->json('POST', '/api/groups', $expected);
        $response
            ->assertStatus(201)
            ->assertJsonFragment($expected);

    }

    public function testGroupRetrieved()
    {
        $group = factory('App\Models\Group')->create();

        $response = $this->json('GET', '/api/groups/' . $group->id);
        $response
            ->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'group_name'
                ]
            ]);
    }

    public function testAllGroupsRetrieved()
    {
        $group = factory('App\Models\Group', 25)->create();

        $response = $this->json('GET', '/api/groups');
        $response
            ->assertStatus(200)
            ->assertJsonCount(25, 'data');
    }

    public function testNoGroupRetrieved()
    {
        $group = factory('App\Models\Group')->create();
        Group::destroy($group->id);

        $response = $this->json('GET', '/api/groups/' . $group->id);
        $response->assertStatus(404);
    }

    public function testGroupUpdated()
    {
        $group = factory('App\Models\Group')->create();

        $updatedGroupName = $this->faker->company();
        $response = $this->json('PUT', '/api/groups/' . $group->id, [
            'group_name' => $updatedGroupName
        ]);
        $response->assertStatus(204);

        $updatedGroup = Group::find($group->id);
        $this->assertEquals($updatedGroupName, $updatedGroup->group_name);
    }

    public function testGroupDeleted()
    {
        $group = factory('App\Models\Group')->create();

        $deleteResponse = $this->json('DELETE', '/api/groups/' . $group->id);
        $deleteResponse->assertStatus(204);

        $response = $this->json('GET', '/api/groups/' . $group->id);
        $response->assertStatus(404);

    }
}
