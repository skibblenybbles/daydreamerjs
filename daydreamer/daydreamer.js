define(
    [
        "./array",
        "./function",
        "./has",
        "./language",
        "./object",
        "./string"
    ],
    function(array, fn, has, language, object, string) {
        return {
            array: array,
            fn: fn,
            has: has,
            language: language,
            object: object,
            string: string
        };
    }
);
