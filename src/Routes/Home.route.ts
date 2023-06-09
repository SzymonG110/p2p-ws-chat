import Route, {MethodArgs, MethodReturn} from '../Types/Route.type'
import wss from '../WebSocket/Index.WebSocket'

export default {
    name: '',
    methods: [
        {
            method: 'get',
            description: 'Home page',

            async run({}: MethodArgs): Promise<MethodReturn> {
                return {
                    render: {
                        name: 'home',
                        data: {
                            online: wss.clients.size
                        }
                    }
                }
            }
        }
    ]
} as Route