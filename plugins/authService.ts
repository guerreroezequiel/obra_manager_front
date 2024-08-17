export default defineNuxtPlugin(() => {
    const login = async (username: string, password: string) => {
        try {
            const response = await fetch('http://localhost:3333/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            const token = data.token;
            localStorage.setItem('authToken', token);
            return token;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const getToken = () => {
        return localStorage.getItem('authToken');
    };

    const logout = () => {
        localStorage.removeItem('authToken');
    };

    return {
        provide: {
            auth: {
                login,
                getToken,
                logout
            }
        }
    };
});