import Route, {MethodArgs, MethodReturn} from '../types/Route.type'

export default {
    path: '',
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