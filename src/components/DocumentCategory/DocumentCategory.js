import ko from 'knockout';
import {gsap} from "gsap";

class DocumentCategory {
    constructor(params) {
        this.id = params.id;
        this.title = params.title;
        this.items = params.items;
        this.isOpen = ko.observable(false);
        this.isClosed = ko.observable(true);
    }

    async toggle(obj, event) {
        let parent = event.target

        if (parent === event.currentTarget) {
            parent = parent.parentNode.parentNode.parentNode.querySelector('.items')
            console.log(parent)
        } else {
            parent = parent.parentNode.parentNode.parentNode.parentNode.querySelector('.items')
            parent.classList.add("is-open")
        }

        if (this.isOpen() === false) {
            parent.classList.add("is-open")
            animateOpen(parent)
            this.isOpen(!this.isOpen());
            this.isClosed(!this.isClosed());
        } else {
            parent.classList.remove("is-open")
            animateClose(parent, this)
        }


    }

    moveItem(item, newIndex) {
        const oldIndex = this.items.indexOf(item);
        if (oldIndex !== -1) {
            this.items.splice(oldIndex, 1); // Удаляем элемент
            this.items.splice(newIndex, 0, item); // Вставляем на новое место
        }
    }

}

function animateOpen(elem) {
    // Открываем контейнер
    gsap.fromTo(
        elem,
        { height: 0, opacity: 0 },
        {
            height: "auto",
            opacity: 1,
            duration: 0.1,
        }
    );
}
function animateClose(elem, context) {
    // Закрываем контейнер
    gsap.to(elem, {
        height: 0,
        opacity: 0,
        duration: 0.1,
        onComplete: function()  {
            elem.classList.remove("is-open");

            context.isOpen(false);
            context.isClosed(true);
        },
    });
}

export default DocumentCategory;