<template>
  <div class="movie-review">
    <div class="movie-poster">
      <img :src="getPoster()" style="max-width: 400px;"/>
      </div>
      <div class="movie-info">
        <h1 class="movie-title">{{ movieInfo.title }}</h1>
        <div class="movie-rating">Rating: {{ averageScore }}/100</div>
        <p class="movie-description" style="font-size: 20px">{{ movieInfo.overview }}</p>
        <hr />
        <h2 class="review-title">Reviews:</h2>
        <div class="review-form">
        <form @submit.prevent="setReview">
            <textarea v-model="review" placeholder="Add your review"></textarea>
              <div class="slider-container">
                <span class="slider-label">0</span>
                <input type="range" class="slider" id="scoreSlider" 
                  @mousedown="showValue = true" @mouseup="showValue = false" 
                    min="0" max="100" :value="ratingValue" @input="ratingValue = $event.target.value">
                <div class="slider-value" id="slider-value" :style="{ visibility: showValue ? 'visible' : 'hidden', fontSize: sliderSize}">{{ratingValue}}</div>
                <span class="slider-label">100</span>
              </div>
            <button type="submit">Submit</button>
        </form>
      </div>
      <div class="review-list">
        <ul style="margin: 0; padding: 0;" id="personal-review">
          <li style="list-style:none">
            <div class="review-section">
              <div class="reviewer-name">[{{curUserReview.userScore}}/100] USER - {{curUserId}}</div>
              <div class="review-content">{{curUserReview.review}}</div>
              <button id="review-delete" type="submit" @click="deleteReview">
              <div>Delete</div>
              </button>
            </div>
          </li>
        </ul> 
        <ul style="margin: 0; padding: 0;">
          <li style="list-style:none" v-for="(review, key) in reviews" :key="key">
            <div class="review-section">
              <div class="reviewer-name">[{{review.userScore}}/100] USER - {{review.userId}} </div>
              <div class="review-content">{{review.review}}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import {collection, onSnapshot, doc, getFirestore, setDoc, deleteDoc} from 'firebase/firestore'
import {getAuth} from 'firebase/auth'
//import { assert } from '@vue/compiler-core'
import axios from 'axios'
  export default {
    name: 'CityList',
    data () {
      return {
        apikey: import.meta.env.VITE_apiKey_TMDB,
        movieInfo: {},
        movieId: this.$route.params.movieid,
        moviePoster: '',
        averageScore: '',
        reviews: {},
        review: '',
        curUserReview: {},
        curUserId: getAuth().currentUser.uid,
        //for slider
        showValue: false,
        ratingValue: '', 
      }
  },
  created() {
    let infoUrl = 'https://api.themoviedb.org/3/movie/' + this.movieId + '?api_key=' + this.apikey;
    axios.get(infoUrl)
    .then((response) => {
      this.movieInfo = response.data;
      console.log(this.movieInfo);
    })
    .catch((error)=>{
      console.log(error)
    })
    this.ratingValue = 50;
  },
  mounted () {
    console.log('Review List');
    const db = getFirestore();
    const colRef = collection(db, "movies");
    const docRef = doc(colRef, this.movieId);
    const subColRef = collection(docRef, "reviews");
    onSnapshot(subColRef, snapShot => {
      this.reviews = snapShot.docs
        .filter(doc => doc.id !== this.curUserId)
        .map(doc => doc.data());
      const userReview = snapShot.docs
        .filter(doc => doc.id === this.curUserId)
        .map(doc => doc.data())
        .shift();
      
      this.curUserReview = userReview || {};
      if(this.curUserReview.userScore != undefined){
        this.ratingValue = this.curUserReview.userScore;
      }

      let personal_review = document.getElementById('personal-review');
      console.log(this.curUserReview.review);
      if(this.curUserReview.review != undefined){
        personal_review.style.display = "block";
      }

      // Update average score
      this.setAverageScore(snapShot.docs.map(doc => doc.data()))
    });
  },

  computed: {
    sliderSize(){
      return 20 + this.ratingValue/2 + 'px';
    }
  },

  methods: {
    async setReview() {
      if(this.review == ""){ //If the textbox is empty, delete the review
        this.deleteReview();
        return;
      }

      this.curUserScore = this.ratingValue;

      const db = getFirestore()
      const docRef = doc(db, "movies", this.movieId);
      const subColRef = collection(docRef, "reviews");
      const subDocRef = doc(subColRef, this.curUserId);
      const dataObj = {review: this.review, userId: this.curUserId, userScore: this.curUserScore};

      let personal_review = document.getElementById('personal-review');
      personal_review.style.display = "block";
      await setDoc(subDocRef, dataObj);
      await setDoc(subDocRef, dataObj);
    },

    async deleteReview(){
      const db = getFirestore()
      const docRef = doc(db, "movies", this.movieId);
      const subColRef = collection(docRef, "reviews");
      const subDocRef = doc(subColRef, this.curUserId);

      let personal_review = document.getElementById('personal-review');
      personal_review.style.display = "none";
      await deleteDoc(subDocRef)
    },

    getPoster (){
      if(this.movieInfo.poster_path != null){
        return 'https://image.tmdb.org/t/p/original' + this.movieInfo.poster_path;
      }
      else return 'https://via.placeholder.com/500x750?text=Poster+Not+Available'
    },
    async setAverageScore(userData){
      let total = 0, i = 0;
      userData.forEach(user => {
        total += parseInt(user.userScore);
        i++
      });
      let average = total/i;
      const db = getFirestore()
      const docRef = doc(db, "movies", this.movieId);
      const dataObj = {averageScore: average};
      if(isNaN(average)){ //If average is NaN, delete the doc altogether
        await deleteDoc(docRef);
        this.averageScore = "-";
      }
      else{
        await setDoc(docRef, dataObj); //Update average score to firebase
        this.averageScore = average; //Update acerage score in this page
      }
    }
  }
}
</script>
  
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

button {
  font-size: 15px;
  border-width: 5px;
  border-color: grey;
}

/* Movie Info CSS */
.movie-review {
  display: flex;
  flex-direction: row;
  margin: 20px;
}
.movie-container {
  display: flex;
  margin-bottom: 20px;
}
.movie-poster{
  margin-right: 20px;
}
.movie-rating {
  font-size: 25px;
  margin-bottom: 10px;
}

/* Review CSS */
.review-form {
  margin-bottom: 20px;
}

.review-form textarea {
  width: 100%;
  height: 100px;
  font-size: 20px;
  padding: 10px;
  margin-bottom: 10px;
}

.review-section{
  margin-bottom: 30px;
}

.reviewer-name{
  text-decoration: underline;
  font-size: 25px;
}

.review-content{
  max-width: 70%;
  margin-bottom: 10px;
  font-size: 15px;
}

#personal-review{
  display: none;
}

/* Slider CSS */

.slider-container{
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 300px;
  margin: 0 auto;
  margin-bottom: 10px;
  margin-top: 10px;
  font-size: 18px;

}

.slider-label {
  width: 10px;
  text-align: center;
}

.slider{
  width: 70%;
}

.slider-value{
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  padding: 5px;
  visibility: hidden;
}

</style>