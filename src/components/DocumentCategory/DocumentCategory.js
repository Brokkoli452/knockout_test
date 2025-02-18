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
            this.isOpen(true);
            this.isClosed(false);
            animateOpen(parent)
        } else {
            parent.classList.remove("is-open")
            animateClose(parent, this)
        }
    }
}

// Открываем контейнер
function animateOpen(elem) {
    gsap.fromTo(
        elem.parentNode,
        { height: 0, opacity: 0 },
        {
            height: "auto",
            opacity: 1,
            duration: 0.2,
        }
    );
}

// Закрываем контейнер
function animateClose(elem, context) {
    gsap.to(elem.parentNode, {
        height: 0,
        opacity: 0,
        duration: 0.2,
        onComplete: function()  {
            elem.classList.remove("is-open");

            context.isOpen(false);
            context.isClosed(true);
        },
    });
}

export default DocumentCategory;