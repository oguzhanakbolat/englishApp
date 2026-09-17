const isDevelopment = __DEV__;

export const log = (...args) => {
	if (isDevelopment) {
		console.log(...args);
	}
};

export const warn = (...args) => {
	if (isDevelopment) {
		console.warn(...args);
	}
};

export const error = (...args) => {
	if (isDevelopment) {
		console.error(...args);
	}
};

export const err = (...args) => {
	if (isDevelopment) {
		console.error(...args);
	}
};

export const criticalError = (...args) => {
	console.error("CRITICAL:", ...args);
};
