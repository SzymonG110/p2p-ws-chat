export default class JSONUtil {
    parse(data: string): object | false {
        try {
            return JSON.parse(data)
        } catch (e) {
            return false
        }
    }
}