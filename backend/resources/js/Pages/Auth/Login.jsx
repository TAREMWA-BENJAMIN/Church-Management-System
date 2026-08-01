import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head>
                <title>Log in</title>
                <link rel="stylesheet" href="/assets/vendor/css/pages/page-auth.css" />
            </Head>
            <div className="container-xxl">
                <div className="authentication-wrapper authentication-basic container-p-y">
                    <div className="authentication-inner">
                        {/* Login Card */}
                        <div className="card">
                            <div className="card-body">
                                {/* Logo */}
                                <div className="app-brand justify-content-center mb-4">
                                    <a href="/" className="app-brand-link gap-2">
                                        <span className="app-brand-logo demo">
                                            <ApplicationLogo style={{ height: '64px', width: 'auto' }} />
                                        </span>
                                    </a>
                                </div>
                                {/* Header */}
                                <h4 className="mb-1 text-center">Welcome!</h4>
                                <p className="mb-6 text-center">Please sign-in to your account and start the adventure</p>

                                {/* Status Message */}
                                {status && (
                                    <div className="alert alert-success" role="alert">
                                        {status}
                                    </div>
                                )}

                                <form onSubmit={submit} className="mb-6">
                                    {/* Email */}
                                    <div className="mb-3">
                                        <InputLabel htmlFor="email" value="Email or Username" />
                                        <TextInput
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            className="form-control"
                                            autoComplete="username"
                                            isFocused={true}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="admin@church.org"
                                        />
                                        <InputError message={errors.email} className="mt-2" />
                                    </div>
                                    {/* Password */}
                                    <div className="mb-3">
                                        <InputLabel htmlFor="password" value="Password" />
                                        <TextInput
                                            id="password"
                                            type="password"
                                            name="password"
                                            value={data.password}
                                            className="form-control"
                                            autoComplete="current-password"
                                            onChange={(e) => setData('password', e.target.value)}
                                            placeholder="••••••••"
                                        />
                                        <InputError message={errors.password} className="mt-2" />
                                    </div>
                                    {/* Remember & Forgot */}
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <label className="form-check mb-0">
                                            <Checkbox
                                                name="remember"
                                                checked={data.remember}
                                                onChange={(e) => setData('remember', e.target.checked)}
                                                className="form-check-input"
                                            />
                                            <span className="form-check-label ms-2">Remember Me</span>
                                        </label>
                                        {canResetPassword && (
                                            <Link href={route('password.request')} className="small">
                                                Forgot Password?
                                            </Link>
                                        )}
                                    </div>
                                    {/* Submit */}
                                    <PrimaryButton className="btn btn-primary d-grid w-100" disabled={processing}>
                                        {processing ? 'Logging in...' : 'Login'}
                                    </PrimaryButton>
                                </form>

                            </div>
                        </div>
                        {/* /Login Card */}
                    </div>
                </div>
            </div>

        </>
    );
}
