import ko from 'knockout';

class DocumentItem {
    constructor(params) {
        this.id = params.item.id;
        this.parentId = params.parentId
        this.name = params.item.name;
        this.onMove = params.onMove; // Функция для перемещения
    }
}

export default DocumentItem;