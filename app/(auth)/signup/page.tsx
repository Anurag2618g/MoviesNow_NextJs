'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function SignupPage() {
    const { signup } = useAuth();
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirm) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);
        try {
            await signup(email, password);
            router.push('/');
        } catch (err: any) {
            setError(err.message || 'Signup failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#141414] flex items-center justify-center px-4"
            style={{ backgroundImage: 'radial-gradient(ellipse at center, #1a1a2e 0%, #141414 70%)' }}>

            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <h1 className="text-[#e50914] font-black text-3xl tracking-tight">MOVIESNOW</h1>
                </div>

                <div className="bg-[#1f1f1f] rounded-xl p-8 shadow-2xl border border-[#333]">
                    <h2 className="text-2xl font-bold text-white mb-6">Create Account</h2>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <Input
                            id="email"
                            type="email"
                            label="Email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                        <Input
                            id="password"
                            type="password"
                            label="Password"
                            placeholder="Min 8 characters"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                        <Input
                            id="confirm"
                            type="password"
                            label="Confirm Password"
                            placeholder="Repeat your password"
                            value={confirm}
                            onChange={e => setConfirm(e.target.value)}
                            required
                        />

                        {error && (
                            <p className="text-sm text-red-400 bg-red-400/10 px-3 py-2 rounded">
                                {error}
                            </p>
                        )}

                        <Button type="submit" variant="danger" size="lg" isLoading={isLoading} className="mt-2 w-full">
                            Create Account
                        </Button>
                    </form>

                    <p className="text-center text-sm text-gray-400 mt-6">
                        Already have an account?{' '}
                        <Link href="/login" className="text-white hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
