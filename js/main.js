gsap.registerPlugin(Draggable,InertiaPlugin) 

const { createApp, ref } = Vue

createApp({
	setup() {		
		let elemsArrOriginal = [
			{img: 'green', number: 0},
			{img: 'red',   number: 0},
			{img: 'blue',  number: 0}
		]
		if (localStorage.getItem('numbers')) {
			let numArr = JSON.parse(localStorage.getItem('numbers'))
			elemsArrOriginal.forEach((elem, index) => {
				elem.number = numArr[index]
			})
		} else {
			let numArr = elemsArrOriginal.map(elem => elem.number)
			numArr = JSON.stringify(numArr)
			localStorage.setItem('numbers', numArr)
		}
		const elemsArr = ref(elemsArrOriginal)
		function RefreshLocalStorageNumbers() {
			let numArr = []
				elemsArr.value.forEach(elem => {
					numArr.push(elem.number)
				})
				numArr = JSON.stringify(numArr)
				localStorage.setItem('numbers', numArr)
		}
		const number = ref(0)
		const elem_index = ref(0)
		function ElemClicked(index){
			if (isDialogToggled.value === false) {				
				elem_index.value = index
				number.value = elemsArr.value[elem_index.value].number
				ToggleDialog()
			}
		}
		const btn_close = ref(null)	
		const isDialogToggled = ref(false)
		function ToggleDialog(){
			if (isFormToggled.value === true) {
				elemsArr.value[elem_index.value].number = number.value
				RefreshLocalStorageNumbers()
				ToggleForm()
			}
			isDialogToggled.value = !isDialogToggled.value
		}
		const isFormToggled = ref(false)
		function ToggleForm(){
			isFormToggled.value = !isFormToggled.value
		}
		function CancelClicked() {
			isFormToggled.value = false
			ToggleDialog()
		}
	return {
		number, elemsArr, elem_index, btn_close, isDialogToggled, ToggleDialog, isFormToggled, ToggleForm, ElemClicked, CancelClicked
	}
	}
	  
}).mount('#app')

// dragndrop =======================================================================
let main_styles = window.getComputedStyle(document.querySelector('html'))
let elem_w = parseInt(main_styles.getPropertyValue('--elem-w'))

const elems = gsap.utils.toArray('.app__elem')
if (localStorage.getItem('elems')) {
	let elemsParsed = JSON.parse(localStorage.getItem('elems'))
	elems.forEach((elem, index) => {
		elem.style.transform = `translate3d(${elemsParsed[index][0]}, ${elemsParsed[index][1]}, 0px)`
	})	
	RefreshLocalStorage()
} else {
	elems.forEach((elem, index) => { 
		elem.style.transform = `translate3d(${index * elem_w}px, 0px, 0px)`
	})
	RefreshLocalStorage()
}
elems.forEach(elem => {	
	Draggable.create(elem, {
		type: 'x,y',
		bounds: document.getElementById("app"),
		inertia: true,	
		edgeResistance: .9,
		snap: function (value) {		
			return Math.round(value / elem_w) * elem_w;
		},
		onDragStart() {
			this.target.classList.add('dragged')
		},
		onDragEnd() {
			this.target.classList.remove('dragged')
			RefreshLocalStorage()
		},
	});
})  
function RefreshLocalStorage() {
	setTimeout(() => {		
		let xyzArr = []
		elems.forEach(elem => {
			let xyz = getTranslate3d(elem)
			xyzArr.push(xyz)
		})	
		xyzArr = JSON.stringify(xyzArr)
		localStorage.setItem('elems', xyzArr)
	},1000)
}
function getTranslate3d(el){
	var values = el.style.transform.split(/\w+\(|\);?/);
	if (!values[1] || !values[1].length) {
		 return [];
	}
	return values[1].split(/,\s?/g);
}