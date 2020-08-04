import React from 'react';
import { shallow } from 'enzyme';
import CSVReader1 from './uploadbutton';
import { GETdataNoBody } from './uploadbutton';
import { fetchdata } from './uploadbutton';

let wrapper;

describe('Upload File Handler Testing', () => {

    let wrapper;

    beforeEach(() => {
      wrapper = shallow(<CSVReader1 />);
    })

    test('should match the snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    test('test GET API call function GETdataNoBody', () => {
      const result = GETdataNoBody('http://127.0.0.1:8000/api/groups');
      expect(result).toMatchObject({});
    });

    test('test PUT API call function', () => {
      const data = {"id":1,"group_name":"Missions"};
      const result = fetchdata('http://127.0.0.1:8000/api/groups',data,'PUT');
      expect(result).toMatchObject({});
    });

    test('test POST API call function', () => {
      const data = {"id":1,"group_name":"Missions"};
      const result = fetchdata('http://127.0.0.1:8000/api/groups',data,'POST');
      expect(result).toMatchObject({});
    });

})