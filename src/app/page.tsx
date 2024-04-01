import Link from 'next/link';

export default function Home() {
    return (
        <main className='flex h-screen items-center justify-center text-center'>
            <div>
                <h1 className='text-3xl'>Portal</h1>
                <Link className='underline' href='/game/'>
                    Playground (in dev)
                </Link>
            </div>
        </main>
    );
}
