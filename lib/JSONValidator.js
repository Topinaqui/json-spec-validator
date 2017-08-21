/*
*@name JSONValidator
*@version 1.0.3
*@Description Validates JSON file against a informed spec.
*@author Franklin O. Veiga
*@date 2017
*/

class JSONValidator {

  constructor(specFile = "") {

    this.spec = this.loadSpec(specFile);
  }

  loadSpec(specFile) {

    let spec = {};

    if (!specFile.length > 0) {
      specFile = "./spec/spec.json";
    }

    fs.readFile(specFile, "utf8", (error, data) => {

      if (!error) {

        spec = JSON.parse(data);

      } else {

        console.log(error);
      }

    });

    return spec;
  }

  validate(object) {

    let message = {};
    message.danger = "The spec is empty.";

    for (let property in this.spec) {

      if (this.spec.hasOwnProperty(property)) {

        message = this.compareProperties(this.spec, object, property);
        if (message.error) {

          delete message.danger;
          break;
        }

      }
    }

    return message;
  }

  compareProperties(spec, target, property) {

    let message = {};

    console.log(target);
    if (!target.hasOwnProperty(property)) {
      if (spec[property].required === true) {

        message.error = `Não foi encontrado ${spec[property].type} ${property}`;
        return message;
      } else {

        message.sucess = `Formato válido.`;
        return message;
      }

    }

    let type = this.checkType(target[property]);

    if (type === spec[property].type) {

      if (spec[property].hasOwnProperty("keys")) {

        message = this.processObjectKeys(spec[property].keys, target[property]);
      } else if (spec[property].hasOwnProperty("items")) {

        message = this.processArrayItems(spec[property].items, target[property]);
      } else {

        message = this.processKey(spec, target, property);
      }

      if (message.error) {

        return message;
      }

    } else {

      message.error = `${property} é do tipo ${type}, deveria ser ${spec[property].type}`;
      return message;
    }

    return message;

  }

  checkType(target) {

    let suposedType = typeof(target);
    let isBooleanObj = (target instanceof Boolean);
    let type = "";

    if (suposedType === "object" && (!isBooleanObj)) {

      if (typeof(target.length) === "number") {

        type = "array";
      } else {

        type = "object";
      }
    } else if (suposedType === "boolean" || isBooleanObj) {

      type = "boolean";
    } else {

      type = suposedType;
    }

    return type;
  }

  processObjectKeys(keys = {}, target) {

    let message = {};
    message.sucess = "Sucesso ... -.-";

    for (let key in keys) {
      if (keys.hasOwnProperty(key)) {

        if (keys[key].type === this.checkType(target[key])) {
          console.log("Verificando: ", key);

          message = this.processKey(keys, target, key);

          if (message.error) {

            break;
          }

        } else {

          message = this.checkProperty(keys[key], target, key);

          if (message.error) {

            return message;
          }
          //Não é mesmo tipo, veio tipo errado...
        }

      }
    }

    return message;
  }

  processArrayItems(items, target) {
    console.log("processArrayItems ");
    console.log(items, target);
    let message = {};

    for (var item in items) {
      if (items.hasOwnProperty(item)) {

        // message = this.compareProperties(items, target, item);

        if (items[item].type === this.checkType(target[item])) {

          message = this.processKey(items, target, item);

          if (message.error) {

            break;
          }

        } else {

          message = this.checkProperty(items[item], target, item);

          if (message.error) {

            return message;
          }
          //Não é mesmo tipo, veio tipo errado...
        }
      }
    }

    return message;
  }

  processKey(keys, target, key) {

    let message = {};

    switch (keys[key].type) {

      case "string": {
        message = this.processString(keys[key], target[key], key);
      }
      break;
      case "number": {
        message = this.processNumber(keys[key], target[key], key);
      }
      break;
      case "object": {
        message = this.processObjectKeys(keys[key].keys, target[key]);
      }
      break;
      case "array": {
        message = this.processArrayItems(keys[key].items, target[key]);
        //message = this.compareProperties(keys[key], target[key], key);
      }
      break;
      case "boolean": {
        message = this.processBoolean(keys[key].items, target[key]);
      }
      break;
      default:{
        message = "Não foi possível processar a chave ${key}.";
      }

    }

    return message;
  }

  checkProperty(spec, target, property) {

    let message = {};
    message.succes = "Formato válido";

    let hasPrperty = target.hasOwnProperty(property);
    let informedType = this.checkType(target[property]);

    if(!hasPrperty) {

      if (spec.required === true) {

        delete message.succes;
        message.error = `A propriedade ${property} é obrigatória, e não está presente.`;

        return message;
      }
    } else if (hasPrperty && informedType != spec.type) {

      delete message.succes;
      message.error = `A propriedade ${property} deve ser ${spec.type} e não ${informedType} .`

    }


    return message;
  }

  processString(spec, target, property) {

    let message = {};

    if (spec.notEmpty === true) {
      console.log(spec.notEmpty, target.length === 0);
      if (target.length === 0) {

        message.error = `String ${property} não pode ser vázia.`;

        return message;
      } else if (target.length > 0){

        message.sucess = "Formato válido.";
        return message;
      }
    }

    //Never reached
    message.sucess = "Formato válido. ;-)";

    return message;
  }

  processNumber(spec, target, property) {

    let message = {};
    console.log(target, spec.notNegative);
    if (spec.notNegative === true) {

      if (target < 0) {

        message.error = `Number ${property} não pode ser negativo.`;

        return message;
      } else if (target > 0){

        message.sucess = "Formato válido.";
        return message;
      }
    }

    //Never reached
    message.sucess = "Formato válido. ;-)";

    return message;
  }

  processBoolean(spec, target, property) {

    let message = {};

    message.sucess = "Formato válido. ;-)";

    return message;
  }

  changeSpec(spec) {

    console.log("I don't change nothing by now...");
  }

}

// Usage:
// let oJSONValidator = new JSONValidator(spec);
// oJSONValidator.validate(json);

module.exports = JSONValidator;
