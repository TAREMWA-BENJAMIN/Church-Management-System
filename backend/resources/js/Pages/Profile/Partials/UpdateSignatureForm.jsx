import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import { useForm, usePage } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { DocumentCheckIcon } from '@heroicons/react/24/outline';

export default function UpdateSignatureForm({ className = '' }) {
    const user = usePage().props.auth.user;
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        signature: null,
    });
    const [preview, setPreview] = useState(user.signature_path ? `/storage/${user.signature_path}` : null);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('signature', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        // Since we are uploading a file, use post, but we configured a dedicated route for it
        post(route('profile.update.signature'), {
            preserveScroll: true,
            onSuccess: () => {
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            },
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Digital Signature
                </h2>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Upload an image of your signature (PNG format with transparent background is highly recommended). 
                    This will be used for automatically signing official church certificates.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6" encType="multipart/form-data">
                <div>
                    <InputLabel htmlFor="signature" value="Signature Image" />

                    <div className="mt-2 flex items-center gap-6">
                        <div className="shrink-0">
                            {preview ? (
                                <img className="h-16 w-32 object-contain bg-white rounded border border-gray-200 dark:border-gray-700 p-1" src={preview} alt="Current signature" />
                            ) : (
                                <div className="h-16 w-32 rounded border border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center bg-gray-50 dark:bg-gray-800 text-gray-400">
                                    <DocumentCheckIcon className="h-6 w-6" />
                                </div>
                            )}
                        </div>
                        
                        <label className="block">
                            <span className="sr-only">Choose signature photo</span>
                            <input 
                                type="file"
                                id="signature"
                                name="signature"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/png, image/jpeg, image/jpg"
                                className="block w-full text-sm text-gray-500 dark:text-gray-400
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-md file:border-0
                                file:text-sm file:font-semibold
                                file:bg-purple-50 file:text-purple-700
                                dark:file:bg-purple-500/10 dark:file:text-purple-400
                                hover:file:bg-purple-100 dark:hover:file:bg-purple-500/20
                                cursor-pointer"
                            />
                        </label>
                    </div>

                    <InputError message={errors.signature} className="mt-2" />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing || !data.signature}>Save Signature</PrimaryButton>

                    {recentlySuccessful && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Saved.
                        </p>
                    )}
                </div>
            </form>
        </section>
    );
}
