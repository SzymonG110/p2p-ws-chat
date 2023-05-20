import styles from '@/styles/page.module.scss'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'

export default function Home() {
    return (
        <div className={styles.hero}>
            <Navbar/>
            <Hero />
        </div>
    )
}
