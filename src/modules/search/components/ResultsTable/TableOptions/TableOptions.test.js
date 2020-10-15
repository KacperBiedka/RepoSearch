import React from 'react';
import { shallow } from "enzyme";
import { findByTestAttr } from "../../../../../../test/testUtils";
import TableOptions from './TableOptions';
import classes from "./TableOptions.module.scss";

const setup = (props = {}) => {
    return shallow(<TableOptions {...props} />);
}

test("changes the value of the per page input based on props", () => {
    let wrapper = setup({
        perPage: 1
    });
    let input = findByTestAttr(wrapper, 'perPage-input');
    let inputValue = input.get(0).props.value;
    expect(inputValue).toBe(1);
    wrapper = setup({
        perPage: 5
    });
    input = findByTestAttr(wrapper, 'perPage-input');
    inputValue = input.get(0).props.value;
    expect(inputValue).toBe(5);
})