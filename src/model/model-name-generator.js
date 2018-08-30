import dom from '../dom';
import upperFirst from 'lodash/upperFirst';
import camelCase from 'lodash/camelCase';

const getNameFromLabel = function(element) {
  //use for attribute to find label
  const id = dom.getId(element);
  if (id) {
    const label = element.ownerDocument.querySelector(`label[for="${id}"`);
    if (label && label.textContent) {
      return label.textContent;
    }
  }
  //iterate parents looking for wrapping label
  let parent = element.parentNode;
  do {
    if (parent.tagName === 'LABEL') {
      return parent.textContent;
    }
  } while ((parent = parent.parentNode));
  return null;
};
const deDupeName = function(model, name) {
  console.log('deDupeName');
  let idx = 2;
  while (model.hasNamedEntity(name)) {
    name = `name${idx}`;
    idx++;
  }
  return name;
};

const cleanName = function(model, name) {
  return deDupeName(model, upperFirst(camelCase(name)));
};

const generateName = function(model, element) {
  const id = dom.getId(element);
  const name = dom.getName(element);
  const textContent = dom.getTextContent(element);
  const tagName = dom.getTagName(element);

  if (/^(?:^INPUT$|^BUTTON$|^SELECT$|^TEXTAREA$|^PROGRESS$|^METER$)$/im.test(tagName)) {
    const labelName = cleanName(model, getNameFromLabel(element));

    if (labelName) {
      return cleanName(model, labelName);
    }

    if ((tagName === 'BUTTON' || /^(?:^SUBMIT$|^RESET$)$/im.test(element.type)) && element.value) {
      return cleanName(model, element.value);
    }
  }
  if (name) {
    return cleanName(model, name);
  }
  if (id) {
    return cleanName(model, id);
  }

  if (tagName === 'A' && element.href && element.href.startsWith('mailto:')) {
    return cleanName(model, element.href.replace('mailto:', '').split('@')[0] + 'EmailLink');
  }

  if (textContent) {
    return cleanName(model, textContent);
  }

  return cleanName(model, `${tagName}${tagIndex}`);
};

export default {
  generateName: generateName,
};