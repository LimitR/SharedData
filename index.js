const v8 = require('v8');
module.exports = class SharedData {
    #data;
    #type = {
        "int8": (length) => new Int8Array(new SharedArrayBuffer(length)),
        "int16": (length) => new Int16Array(new SharedArrayBuffer(length)),
        "int32": (length) => new Int32Array(new SharedArrayBuffer(length)),
        "uint8": (length) => new Uint8Array(new SharedArrayBuffer(length)),
        "uint16": (length) => new Uint16Array(new SharedArrayBuffer(length)),
        "uint32": (length) => new Uint32Array(new SharedArrayBuffer(length)),
        "float32": (length) => new Float32Array(new SharedArrayBuffer(length)),
        "float64": (length) => new Float64Array(new SharedArrayBuffer(length)),
    }
    /**
     * 
     * @param {number} length Size BufferArray
     * @param {'int8'|'int16'|'int32'|'uint8'|'uint16'|'uint32'|'float32'|'float64'} type Type BufferArray
     * @default type int32
     */
    constructor(length, type){
        this.#data = this.#type[type] === undefined ? this.#type["int32"](length) : this.#type[type](length);
    }
    /**
     * 
     * @param {workerData} data 
     * @description It's method return new class SharedData, with SharedArrayBuffer
     * @returns {SharedData}
     */
    new(data){
        this.#data = data;
        return this;
    }
    /**
     * @param {Object|Array|string|number|boolean} data 
     */
    add(data){
        v8.serialize(data).map((element, index) => {
            Atomics.add(this.#data, index, element);
        });
    }
    /**
     * @param {Object|Array|string|number|boolean} data 
     * @description Not atomics method
     */
    na_add(data){
        v8.serialize(data).map((element, index) => {
            this.#data[index] = element;
        });
    }
    /**
     * @description Not atomics method
     * @returns {number[]} Array bytes
     */
    na_get(){
        return this.#data;
    }
    /**
     * 
     * @param {number} from from index
     * @param {number} to to index
     * @returns {number[]} Array bytes
     */
    get(from, to){
        const result = [];
        while(from < to){
            result.push(Atomics.load(this.#data, from))
            from++;
        }
        return result;
    }
    /**
     * 
     * @param {SharedArrayBuffer|null} data
     * @description Method return data from class SharedData, or serialized data from argument
     * @returns {*}
     */
    serialize(data){
        return data ? v8.deserialize(new Buffer.from(new Int16Array(data))) : v8.deserialize(new Buffer.from(new Int16Array(this.#data)));
    }
}