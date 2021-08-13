const ADD_BUTTON_EL = document.querySelector('button.add');
const AGE_EL = document.querySelector('#age');
const HOUSEHOLD_EL = document.querySelector('.household');
const RESULT_EL = document.querySelector('pre');
const SUBMIT_BUTTON_EL = document.querySelector('button[type="submit"');

AGE_EL.setAttribute('type', 'number');

const state = {
  membersMap: {}
}

const FIELDS_OBJ = [
  { 
    id: 'age', 
    label: 'Age', 
    isRequired: true, 
    validator: value => value > 0, 
    element: document.querySelector('#age'), 
    errorMessage: 'Age is required and must be greater than 1' 
  }, 
  { 
    id: 'rel', 
    label: 'Relationship', 
    isRequired: true, 
    validator: () => true, 
    element: document.querySelector('#rel'), 
    errorMessage: 'Relationship is required' 
  }, 
  { 
    id: 'smoker', 
    label: 'Smoker', 
    validator: () => true, 
    element: document.querySelector('#smoker') 
  }
];

const createFamilyMemberElement = (obj, id) => {
  const elementId = `person-${id}`;
  const member_el = createElement({ tag: 'li', attributes: { id: elementId }});

  const member_details_el = createElement({tag: 'ul'});

  Object.entries(obj).forEach(([id, value]) => {
    const detail_el = createElement({tag: 'li', value: `${id}: ${value}` });
    member_details_el.append(detail_el);
  });

  member_details_el.append(createRemoveButton(id, elementId));
  member_el.append(member_details_el);
  return member_el;
}

const createRemoveButton = (memberId, elementId)=> {
  const button = createElement({ tag: 'button', value: 'remove' });
  button.addEventListener('click', function () {
    document.querySelector(`#${elementId}`).remove();
    delete state.membersMap[memberId];
    resetSubmissionText();
  });
  return button;
};

const resetFields = () => {
  FIELDS_OBJ.forEach(field => {
    resetValue(field.element);
  });
};

const resetSubmissionText = () => {
  if (RESULT_EL.style.display !== 'none') {
    RESULT_EL.style.display = 'none';
  }
};

const getValidationErrors = () => {
  return FIELDS_OBJ
  .filter(field => {
    const requiredAndHasNoValue = field.isRequired && !getValue(field.element);

    return requiredAndHasNoValue || !field.validator(getValue(field.element));
  })
  .map(field => field.errorMessage);
};

const alertValidationErrors = errors => {
  let validationErrors = '';
  errors.forEach(message => validationErrors += `${message}\n`);
  alert(validationErrors);
};

const createPersonData = () => {
  return FIELDS_OBJ.reduce((obj, field) => {
    obj[field.id] = getValue(field.element);
    
    return obj;
  }, {});
}


ADD_BUTTON_EL.addEventListener('click', event => {
  event.preventDefault(); // prevent page reload
  const errors = getValidationErrors();
  if (errors.length) {
    alertValidationErrors(errors);
    return;
  }
  const personId = Date.now();
  const newPerson = createPersonData();
  state.membersMap[personId] = newPerson;
  HOUSEHOLD_EL.append(createFamilyMemberElement(newPerson, personId));
  resetFields();
  resetSubmissionText();
});

SUBMIT_BUTTON_EL.addEventListener('click', event => {
  event.preventDefault(); // prevent page reload
  const json = JSON.stringify(Object.values(state.membersMap));
  const RESULT_EL = document.querySelector('pre');
  RESULT_EL.innerHTML = json;
  RESULT_EL.style.display = 'block';
});

/* UTIL FUNCTIONS */
const getValue = element => {
  const { type } = element;
  switch(type) {
    case 'checkbox':
      return element.checked;
    default:
      return element.value;
  }
}

const resetValue = element => {
  const { type } = element;
  switch(type) {
    case 'checkbox':
      element.checked = false;
    default:
      element.value = '';
  }
}

const createElement = ({ tag, attributes, value }) => {
  const elem = document.createElement(tag);

  if (value) {
    elem.innerHTML = value;
  }

  if (attributes) {
    Object.entries(attributes).forEach(([attribute, val]) => {
      elem.setAttribute(attribute, val);
    });
  }

  return elem;
}
