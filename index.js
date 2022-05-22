const v8 = require('v8');
module.exports = class SharedData {
    #data;
    #typeConfigurator = {
        "int8": (data) => new Int8Array(data),
        "int16": (data) => new Int16Array(data),
        "int32": (data) => new Int32Array(data),
        "uint8": (data) => new Uint8Array(data),
        "uint16": (data) => new Uint16Array(data),
        "uint32": (data) => new Uint32Array(data),
        "float32": (data) => new Float32Array(data),
        "float64": (data) => new Float64Array(data),
    };
    #type;
    /**
     * @param {number} length Size BufferArray
     * @param {'int8'|'int16'|'int32'|'uint8'|'uint16'|'uint32'|'float32'|'float64'} type Type BufferArray
     * @default type int32
     * @default length 1024
     */
    constructor(length = 1024, type){
        this.#type = type || "int32";
        this.#data = this.#typeConfigurator[type] === undefined ?
        this.#typeConfigurator["int32"](new SharedArrayBuffer(length)) :
        this.#typeConfigurator[type](new SharedArrayBuffer(length));
    }
    /**
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
     * @param {SharedArrayBuffer|null} data
     * @description Method return data from class SharedData, or serialized data from argument
     * @returns {*}
     */
    serialize(data){
        return v8.deserialize(new Buffer.from(this.#typeConfigurator[this.#type](data || this.#data)));
    }
}