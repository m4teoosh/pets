// itemPickerUI.js

export class ItemPickerUI {
  constructor(containerElement, items) {
    this.container = containerElement;
    this.totalSlots = 10;
    this.items = items; // Only 2 for now, rest are empty
    this.selectedIndex = 0;

    this.createUI();
  }

  createUI() {
    this.uiElement = document.createElement("div");
    this.uiElement.className = "item-picker-ui";

    this.itemElements = [];

    for (let i = 0; i < this.totalSlots; i++) {
      const itemDiv = document.createElement("div");
      itemDiv.className = "item";

      if (this.items[i]) {
        const img = document.createElement("img");
        //insert into string item name
        img.src = `assets/${this.items[i]}.png`;
        img.alt = this.items[i];
        itemDiv.appendChild(img);
      }

      itemDiv.addEventListener("click", () => this.selectItem(i));
      this.uiElement.appendChild(itemDiv);
      this.itemElements.push(itemDiv);
    }

    this.updateSelection();
    this.container.appendChild(this.uiElement);
  }

  selectItem(index) {
    this.selectedIndex = index;
    this.updateSelection();
  }

  updateSelection() {
    this.itemElements.forEach((el, i) => {
      el.classList.toggle("selected", i === this.selectedIndex);
    });
  }

  getSelectedItem() {
    return this.items[this.selectedIndex];
  }
}
