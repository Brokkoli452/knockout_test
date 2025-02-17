import ko from 'knockout';
import DocumentCategory from './components/DocumentCategory/DocumentCategory';
import DocumentItem from './components/DocumentItem/DocumentItem';
import './index.css'

// Данные для категорий и элементов
const categories = [
    {
        id: 1,
        title: "Обязательные для всех",
        items: [
            { id: 1, name: "Паспорт" },
            { id: 2, name: "ИНН" }
        ]
    },
    {
        id: 2,
        title: "Обязательные для трудоустройства",
        items: [
            { id: 3, name: "Мед. книжка" },
            { id: 4, name: "Справка об отсутствии судимостей" }
        ]
    },
    {
        id: 3,
        title: "Специальные",
        items: [
            { id: 3, name: "Разрешение на работу" },
        ]
    }
];

// ViewModel приложения
class AppViewModel {
    constructor() {
        this.categories = ko.observableArray(categories.map(cat => new DocumentCategory(cat)));
        this.draggedItem = ko.observable(null);
        this.draggedCategory = ko.observable(null);
        this.initialPosition = null;
    }

    moveItem(item, newCategoryId, newIndex) {
        const oldCategory = this.categories().find(c =>
            c.items().some(i => i.id === item.id)
        );
        oldCategory.items.remove(item);

        const newCategory = this.categories().find(c => c.id === newCategoryId);
        newCategory.items.splice(newIndex, 0, item);
    }

    moveCategory(category, newIndex) {
        const oldIndex = this.categories.indexOf(category);
        this.categories.splice(oldIndex, 1);
        this.categories.splice(newIndex, 0, category);
    }
}

// Регистрация компонентов
ko.components.register('document-category', {
    viewModel: DocumentCategory,
    template: require('./components/DocumentCategory/DocumentCategory.html').default
});

ko.components.register('document-item', {
    viewModel: DocumentItem,
    template: require('./components/DocumentItem/DocumentItem.html').default
});

// Привязка ViewModel к View
const viewModel = new AppViewModel();
ko.applyBindings(viewModel);
