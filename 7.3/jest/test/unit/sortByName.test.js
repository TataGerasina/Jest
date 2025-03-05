const sorting = require("../../app");

describe("Books names test suit", () => {
	it("Books names should be sorted in ascending order", () => {
		const input = [
			"Гарри Поттер",
			"Властелин Колец",
			"Волшебник изумрудного города",
		];

		const expected = [
			"Властелин Колец",
			"Волшебник изумрудного города",
			"Гарри Поттер",
		];

		const output = sorting.sortByName(input);

		expect(output).toEqual(expected);
	});
});


describe("Test for book titles with part number", () => {
	it("Book titles should be sorted in ascending order based on the part number", () => {
		const input = [
			"Гарри Поттер 2 часть",
			"Гарри Поттер 1 часть",
			"Властелин Колец 1 часть",
			"Волшебник изумрудного города 1 часть",
			"Властелин Колец 2 часть",
			"Волшебник изумрудного города 10 часть"
		];

		const expected = [
			"Властелин Колец 1 часть",
			"Властелин Колец 2 часть",
			"Волшебник изумрудного города 1 часть",
			"Волшебник изумрудного города 10 часть",
			"Гарри Поттер 1 часть",
			"Гарри Поттер 2 часть"
		];

		const output = sorting.sortByName(input);

		expect(output).toStrictEqual(expected);
	});
});

describe("A set of tests for determining the names of books in English", () => {
	it("Book titles should be sorted in ascending order based in English", () => {
		const input = [
			"The Wizard of Oz",
			"Lord of the Rings",
			"Harry Potter",
			
		];

		const expected = [
			"Harry Potter",
			"Lord of the Rings",
			"The Wizard of Oz"
		];

		const output = sorting.sortByName(input);

		expect(output).toEqual(expected);
	});
});

describe("Books names test suit 1", () => {
	it("Books names should be sorted in ascending order", () => {
		const input = [
			"Гарри Поттер!",
			"Властелин Колец",
			"Волшебник изумрудного города",
		];

		const expected = [
			"Властелин Колец",
			"Волшебник изумрудного города",
			"Гарри Поттер!",
		];

		const output = sorting.sortByName(input);

		expect(output).toEqual(expected);
	});
});


describe("Books names test suit 2", () => {
	it("Books names should be sorted in ascending order ", () => {
		const input = [
			"Гарри Поттер",
			"Гарри Поттер",
			"Волшебник изумрудного города",
		];

		const expected = [
			"Волшебник изумрудного города",
			"Гарри Поттер",
			"Гарри Поттер",
		];

		const output = sorting.sortByName(input);

		expect(output).toEqual(expected);
	});
});