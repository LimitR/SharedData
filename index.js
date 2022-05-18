const v8 = require('v8');
module.exports = class SharedData {
    #data;
    constructor(length){
        this.#data = new Int16Array(new SharedArrayBuffer(length));
    }
    new(data){
        this.#data = data;
        return this;
    }
    add(data){
        v8.serialize(data).map((element, index) => {
            this.#data[index] = element;
        });
    }
    get(){
        return this.#data;
    }
    serialize(data){
        return data ? v8.deserialize(new Buffer.from(new Int16Array(data))) : v8.deserialize(new Buffer.from(new Int16Array(this.#data)));
    }
}