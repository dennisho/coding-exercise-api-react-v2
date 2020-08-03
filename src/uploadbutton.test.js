import React from 'react';
import { shallow } from 'enzyme';
import CSVReader1 from './uploadbutton';

let wrapper;

describe('Upload File Handler Testing', () => {

    let wrapper;

    beforeEach(() => {
      wrapper = shallow(<CSVReader1 />);
    })

    test('should match the snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

})