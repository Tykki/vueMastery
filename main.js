let eventBus = new Vue()

Vue.component('product-tabs', {
	props: {
		reviews: {
			type: Array,
			required: false
		},
		shipping: {
			type: String,
			required: true
		},
		details: {
			type: Array,
			required: true
		}
	},
	template:`
	<div>
		<h3><span class="tab" :class="{activeTab: selectedTab === tab}" v-for="(tab, index) in tabs" 
		:key="index" @click="selectedTab = tab">{{tab}}</span></h3>
		<div v-show="selectedTab === 'Reviews'">

		        <p v-if="!reviews.length">There are no reviews yet.</p>
		        <ul>
		          <li v-for="review in reviews">
		          <p>{{ review.name }}</p>
		          <p>Rating: {{ review.rating }}</p>
		          <p>{{ review.review }}</p>
		          <p>Recommendation: {{ review.recommend }}</p>
		          </li>
		        </ul>
		    </div>
			
			<product-review v-show="selectedTab === 'Make a Review'"></product-review>
			<div v-show="selectedTab === 'Shipping'">
			<p>Shipping: {{shipping}}</p>
				
			</div>
			<div v-show="selectedTab === 'Details'">
				<ul>
				<li v-for="detail in details">{{detail}}</li>
			</ul>
			</div>
	</div>`,
	data(){
		return{
			tabs: ['Reviews', 'Make a Review', 'Shipping', 'Details'],
			selectedTab: 'Review'
		}
	}

})

Vue.component('product-review', {
      template: `
        <form class="review-form" @submit.prevent="onSubmit">
			<p v-if="errors.length">
		      <b>Please correct the following error(s):</b>
		      <ul>
		        <li v-for="error in errors">{{ error }}</li>
		      </ul>
		    </p>

      <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name" placeholder="name">
      </p>
      
      <p>
        <label for="review">Review:</label>      
        <textarea id="review" v-model="review"></textarea>
      </p>
      
      <p>
        <label for="rating">Rating:</label>
        <select id="rating" v-model.number="rating">
          <option>5</option>
          <option>4</option>
          <option>3</option>
          <option>2</option>
          <option>1</option>
        </select>
      </p>
      <p>
      	<label for="recommend">Would you recommend this product?</label>
		<input type="radio" name="recommend" v-model="recommend" value="Yes"> Yes
		<input type="radio" name="recommend" v-model="recommend" value="No"> No
      </p>
      
      <p>
        <input type="submit" value="Submit">  
      </p>    
    
    </form>
      `,
      data() {
        return {
          name: null,
          review: null,
          rating: null,
          recommend: null,
          errors: []
        }
      },
      methods: {
      	onSubmit(){
      		this.errors = []
      		if(this.name && this.review && this.rating && this.recommend) {
		        let productReview = {
		          name: this.name,
		          review: this.review,
		          rating: this.rating,
		          recommend: this.recommend
		        }
		        eventBus.$emit('review-submitted', productReview)
		        this.name = null
		        this.review = null
		        this.rating = null
		        this.recommend = null
		      } else {
			        if(!this.name) this.errors.push("Name required.")
			        if(!this.review) this.errors.push("Review required.")
			        if(!this.rating) this.errors.push("Rating required.")
			        if(!this.recommend) this.errors.push("Recommendation required.")

		    }
      	}
      	
      }
    })

Vue.component('product', {
	props: {
		premium: {
			type: Boolean,
			required: true
		}
	},
	template: `
		<div class="product">
			<div class="product-image">
				<img v-bind:src="image" alt="">
			</div>
			<div class="product-info">
			<h1>{{title}}</h1>
			<h3 v-if="onSale">{{sale}}</h3>
			<p v-if="inventory > 10">In Stock</p>
			<p v-else-if="inventory < 10 && inventory > 0">Almost Sold Out</p>
			<p v-else :style="{'text-decoration': 'line-through'}">Out of Stock</p>
			
			<div v-for="(variant, index) in variants" :key="variant.varId" class="color-box" :style="{backgroundColor: variant.varColor}" @mouseover="updateProduct(index)">

			</div>
			<select >
				<option v-for="size in sizes">{{size}}</option>
			</select>
			<button v-on:click="addToCart" :disabled="!inStock" :class="{disabledButton: !inStock}">Add to Cart</button>
			<button v-on:click="removeFromCart">Remove from Cart</button>
			
				


			</div>
			<product-tabs :reviews="reviews" :shipping="shipping" :details="details"></product-tabs>

		</div>

		`,
	data() {
		return ({
			brand: 'Vue Mastery',
		product: 'Socks',
		selVar: 0,
		reviews: [],
		link: 'https://google.com',
		inventory: '0',
		onSale: true,
		details: ["80% cotton", "20% polyester", "Gender-Neutral"],
		sizes: ["small", "medium", "large"],
		
		variants: [
			{
				varId: 2234,
				varColor: "green",
				varImg: "./assets/greenWhiteSocks.jpg",
				varQuan: 10
			},
			{
				varId: 2235,
				varColor: "blue",
				varImg: "./assets/blueWhiteSocks.jpg",
				varQuan: 100
			}
		]
		})
	},		
	methods: {
	    addToCart() {
	      this.$emit('add-to-cart', this.variants[this.selVar].varId)
	    },
	    updateProduct(index){
	    	this.selVar = index
	    },
	    removeFromCart(){
	    	this.$emit('remove-from-cart', this.variants[this.selVar].varId)
	    },
	   	    
	},
	computed: {
		title() {
			return this.brand + ' ' + this.product
		},
		image(){
			return this.variants[this.selVar].varImg
		},
		inStock(){
			return this.variants[this.selVar].varQuan
		},
		sale(){
			return this.brand + ' ' + this.product + ' is on sale'
			// if (this.onSale === true){
			// 	return this.brand + ' ' + this.product + ' is on sale'
			// }
			// this.onSale ? return this.brand + ' ' + this.product + ' is on sale'
		},
		shipping(){
			if (this.premium){
				return "free"
			}
			else{
				return "2.99"
			}
		},
	},
	mounted() {
		eventBus.$on('review-submitted', productReview => {
			this.reviews.push(productReview)
		});
		eventBus.$on()
	}
})



let app = new Vue({
	el: '#app',
	data: {
		details: 'whabbalubbaDUBDUB',
		cart: [],
		premium: true
	},
	methods: {
		updateCart(id){
			this.cart.push(id)
		},
		removeCart(id){
			this.cart.splice(this.cart.indexOf(id), 1);
		}
		
	}
	
})