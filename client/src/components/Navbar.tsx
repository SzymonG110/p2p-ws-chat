import '@/styles/navbar.component.scss'

export default function Navbar() {
    return (
        <div className='navbar'>
            <div className='container'>
                <div className='leftNavbar'>
                    <div className='logo'>
                        <span className='text'>XChat</span>
                        <br/>
                        <span className='online'>Online: 91274</span>
                    </div>
                </div>
                <div className='rightNavbar'>
                    <a href='https://google.com' target='_blank'>DISCORD</a>
                </div>
            </div>
        </div>
    )
}