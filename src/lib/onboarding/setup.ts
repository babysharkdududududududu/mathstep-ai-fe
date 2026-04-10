const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface OnboardingStudentRequest {
    grade_level: string;
}

export async function submitStudentOnboarding(
    data: OnboardingStudentRequest,
    token: string
): Promise<void> {
    const response = await fetch(`${API_URL}/setup/onboarding/student`, {
        method: 'PUT', // ✅ FIX
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // ✅ FIX
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to submit onboarding');
    }
}