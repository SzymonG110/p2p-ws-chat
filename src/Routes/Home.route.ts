import Route, {MethodArgs, MethodReturn} from '../Types/Route.type'

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
                            online: 123
                        }
                    }
                }
            }
        }
    ]
} as Route