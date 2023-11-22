class OpenAiApiStatusIndicator{
    #indicatorSlug;
    #httpStatusTranslation;
    #isOperational;

    static #indicators=[
        new this('none',200,true),
        new this('minor',399,true),
        new this('major',500,false),
        new this('critical',500,false),
    ];


    constructor(indicatorSlug, httpStatusTranslation, isOperational) {
        this.#indicatorSlug = indicatorSlug;
        this.#httpStatusTranslation = httpStatusTranslation;
        this.#isOperational = isOperational;
    }


    get indicatorSlug() {
        return this.#indicatorSlug;
    }

    get httpStatusTranslation() {
        return this.#httpStatusTranslation;
    }

    get isOperational() {
        return this.#isOperational;
    }


    static get indicators(){
        return this.#indicators;
    }

    publicRepresentation() {
        return {
            indicatorSlug: this.indicatorSlug,
            httpStatusTranslation: this.httpStatusTranslation,
            isOperational: this.isOperational
        };
    }
}

module.exports=OpenAiApiStatusIndicator;