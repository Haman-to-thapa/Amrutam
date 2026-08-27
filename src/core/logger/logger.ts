type LogContext = Record<string, unknown>;

function safeSerialize(value: unknown): unknown {
    if (value instanceof Error) {
        return {
            name: value.name,
            message: value.message,
            stack: value.stack,
        };
    }

    return value;
}

function write(
    level: 'debug' | 'info' | 'warn' | 'error',
    message: string,
    context?: LogContext,
) {
    if (!__DEV__ && level === 'debug') {
        return;
    }

    const payload = context
        ? Object.fromEntries(
            Object.entries(context).map(([key, value]) => [
                key,
                safeSerialize(value),
            ]),
        )
        : undefined;

    switch (level) {
        case 'debug':
            console.debug(`[DEBUG] ${message}`, payload ?? '');
            break;

        case 'info':
            console.info(`[INFO] ${message}`, payload ?? '');
            break;

        case 'warn':
            console.warn(`[WARN] ${message}`, payload ?? '');
            break;

        case 'error':
            console.error(`[ERROR] ${message}`, payload ?? '');
            break;
    }
}

export const logger = {
    debug(message: string, context?: LogContext) {
        write('debug', message, context);
    },

    info(message: string, context?: LogContext) {
        write('info', message, context);
    },

    warn(message: string, context?: LogContext) {
        write('warn', message, context);
    },

    error(message: string, context?: LogContext) {
        write('error', message, context);
    },
};