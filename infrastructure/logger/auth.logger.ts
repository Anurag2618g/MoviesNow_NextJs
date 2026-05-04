type AuthEvent = "LOGIN_SUCCESS" | "LOGIN_FAILURE" | "REFRESH_SUCSESS" | "REFRESH_FAILURE" | "LOGOUT" | "SESSION_REUSE_DETECTED";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const logAuthEvent = (event: AuthEvent, meta: Record<string, any>) => {
    console.log(
        JSON.stringify({ 
            event,
            timeStamp: new Date().toString(),
            ...meta,
        })
    );
};