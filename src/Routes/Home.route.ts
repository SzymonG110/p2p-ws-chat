import Route, {MethodArgs, MethodReturn} from '../Types/Route.type'

export default {
    name: '',
    methods: [
        {
            method: 'get',
            description: 'Home page',

            async run({req}: MethodArgs): Promise<MethodReturn> {
                return {
                    render: {name: 'home'}
                }
            }
        }
    ]
} as Route