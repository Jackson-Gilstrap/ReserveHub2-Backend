

export function convertStr2Bool (arg) {
    console.log(typeof(arg))
    console.log(arg)
    //handle if value is false return the value
    if(arg === 'false') {
        return false;
    } else {
        return true
    }

}