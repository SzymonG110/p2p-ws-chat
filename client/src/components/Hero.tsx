import '@/styles/hero.component.scss'

export default function Hero() {
    return (
        <>
            <div className='left'>
                <div>
                    <div className='heroTitle'>XChat</div>
                    <div className='heroSubtitle'>aplikacja webowa do rozmowy z ludźmi</div>
                    <button className='connect'>ROZMAWIAJ</button>
                </div>
            </div>
            <div className='right'>
            </div>
        </>
    )
}