/** @param {NS} ns */
export async function main(ns) {
	const testNumbers = [123, 1230, 12340, 123450, 1234560, 12345670, 123456780, 1234567890, 12345678900];

	for (let testNumber of testNumbers) {
		ns.tprint(`Raw: ${testNumber}\tformatted: ${formatNumber(testNumber, '$')}`);
	}
}

/** @param {NS} ns */
export function formatNumber(number, unit) {
	if (number==0) {
		return `${number} ${unit}`;
	}
	
	const decimals = 2;
	const k = 1000;
    const sizes = ['', 'k', 'm', 'g', 't', 'p', 'e', 'z', 'y']

    const index = Math.floor(Math.log(number) / Math.log(k));

    return `${parseFloat((number / Math.pow(k, index)).toFixed(decimals))} ${sizes[index]}${unit}`
}