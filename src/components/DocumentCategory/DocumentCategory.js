import ko from 'knockout';

class DocumentCategory {
    constructor(params) {
        this.id = params.id;
        this.title = params.title;
        this.items = params.items;
        this.isOpen = ko.observable(false);
        this.isClosed = ko.observable(true);
    }

    async toggle(elem) {
        console.log(elem.items)

        const done = setTimeout(() => {
            this.isOpen(!this.isOpen());
            this.isClosed(!this.isClosed());
        }, 300)
    }

    moveItem(item, newIndex) {
        const oldIndex = this.items.indexOf(item);
        if (oldIndex !== -1) {
            this.items.splice(oldIndex, 1); // Удаляем элемент
            this.items.splice(newIndex, 0, item); // Вставляем на новое место
        }
    }

}

export default DocumentCategory;