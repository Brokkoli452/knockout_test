import ko from 'knockout';
import DocumentCategory from './components/DocumentCategory/DocumentCategory';
import DocumentItem from './components/DocumentItem/DocumentItem';
import './index.css'

document.addEventListener("DOMContentLoaded", function () {
    const draggableCategories = document.querySelectorAll(".categories.container > .draggable");
    const CategoryContainers = document.querySelectorAll(".categories.container");
    const draggableItems = document.querySelectorAll(".document-item.draggable");
    const ItemContainers = document.querySelectorAll(".items.container");

    console.log(`draggableCategories: `);
    console.log(draggableCategories);

    // Функция для перетаскивания категорий
    function dragNDropCategories(draggables, containers) {
        draggables.forEach((draggable) => {
            const handle = draggable.querySelector('.move-handle')
            handle.onmousedown = function(e) {
                e.target.parentNode.setAttribute('draggable', 'true')
            };
            handle.onmouseup = function(e) {
                e.target.parentNode.setAttribute('draggable', 'false')
            };

            draggable.addEventListener("dragstart", (e) => {
                // Проверяем, что перетаскивается именно категория, а не элемент
                if (!e.target.classList.contains("document-item")) {
                    draggable.classList.add("dragging");
                    console.log("Dragging category: ", draggable);
                }
            });

            draggable.addEventListener("dragend", (e) => {
                draggable.classList.remove("dragging");
                containers.forEach((container) => {
                    clearHighlights(container);
                });
            });
        });

        containers.forEach((container) => {
            container.addEventListener("dragover", (e) => {
                e.preventDefault();
                const dragging = container.querySelector(".dragging");

                if (!dragging || dragging.classList.contains("document-item")) return; // Проверяем, что dragging существует

                const dropTarget = getDropPosition(container, e.clientY);

                if (dropTarget && !dragging.contains(dropTarget)) {
                    container.children[container.children.length - 1].classList.remove(
                        "highlight-bottom-border"
                    );
                    dropTarget.classList.add("highlight-top-border");
                    container.insertBefore(dragging, dropTarget);
                } else if (!dropTarget) {
                    container.appendChild(dragging);
                    clearHighlights(container);
                    container.lastChild.classList.add("highlight-bottom-border");
                }
            });

            container.addEventListener("dragleave", (e) => {
                e.preventDefault();
                clearHighlights(container);
            });
        });
    }

    // Функция для перетаскивания элементов
    function dragNDropItems(draggables, containers) {
        draggables.forEach((draggable) => {
            const handle = draggable.querySelector('.move-handle')
            handle.onmousedown = function(e) {
                e.target.parentNode.setAttribute('draggable', 'true')
            };
            handle.onmouseup = function(e) {
                e.target.parentNode.setAttribute('draggable', 'false')
            };

            draggable.addEventListener("dragstart", (e) => {
                // Останавливаем всплытие события, чтобы не активировать перетаскивание категории
                e.stopPropagation();
                draggable.classList.add("dragging");
                console.log("Dragging item: ", draggable);
            });

            draggable.addEventListener("dragend", (e) => {
                draggable.classList.remove("dragging");
                containers.forEach((container) => {
                    clearHighlights(container);
                });
            });
        });

        containers.forEach((container) => {
            container.addEventListener("dragover", (e) => {
                e.preventDefault();
                const dragging = document.querySelector(".dragging");

                if (!dragging || !dragging.classList.contains("document-item")) {
                    return; // Проверяем, что dragging существует и принадлежит этому контейнеру
                }

                const dropTarget = getDropPosition(container, e.clientY);

                if (dropTarget && !dragging.contains(dropTarget)) {
                    container.children[container.children.length - 1].classList.remove(
                        "highlight-bottom-border"
                    );
                    dropTarget.classList.add("highlight-top-border");
                    container.insertBefore(dragging, dropTarget);
                } else if (!dropTarget) {
                    container.appendChild(dragging);
                    clearHighlights(container);
                    container.lastChild.classList.add("highlight-bottom-border");
                }
            });

            container.addEventListener("dragleave", (e) => {
                e.preventDefault();
                clearHighlights(container);
            });
        });
    }

    // Общая функция для определения позиции drop
    function getDropPosition(container, y) {
        const draggableElements = [
            ...container.querySelectorAll(".draggable:not(.dragging)"),
        ];
        for (const draggable of draggableElements) {
            const pos = draggable.getBoundingClientRect();
            if (y < pos.bottom && pos.bottom - y > 20) {
                return draggable;
            }
        }
        return null;
    }

    // Общая функция для очистки подсветки
    function clearHighlights(container) {
        for (const child of container.children) {
            child.classList.remove("highlight-top-border");
            child.classList.remove("highlight-bottom-border");
        }
    }

    // Инициализация перетаскивания для категорий и элементов
    dragNDropCategories(draggableCategories, CategoryContainers);
    dragNDropItems(draggableItems, ItemContainers);

});


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
