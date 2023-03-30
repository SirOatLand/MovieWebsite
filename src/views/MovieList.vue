// src/components/Info.vue
<template>
  <div style="margin: 50px; text-align: center; color: white"><h1>Movie</h1></div>
  <div class="searchBox">
  <input type="text" placeholder="Search Movie Name" v-model="search"> 
  </div>
  <div class="Info">
    <div class>
      <div class="row">
        <div class="col-12 d-flex flex-wrap">
          <div class="col-lg-2 col-md-3 col-sm-4 col-5 mb-4" v-for="(movie, key) in movieList" :key="key">
            <router-link :to = "{path: 'info', name: 'Info', params: {movieid: movieList[key].id}}">
              <div class="card">
                <img :src="getPoster(key)" class="card-img-top" id="PosterImg">
                <div class="card-body movie-title">
                  <h5 class="card-title">{{movie.title}}</h5>
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Weather',
  data () {
    return {
      movieList: {},
      search: '',
      apiKey: import.meta.env.VITE_apiKeyTMDB
    }
  },
  created () {
    this.fetchMovies(this.search);
  },

  watch: {
    search: function (newValue, oldValue) {
      this.fetchMovies(newValue);
    },
  },
  
  methods: {
    fetchMovies(searchInput){
      if(searchInput == '') searchInput = 'A';
      let infoUrl = 'https://api.themoviedb.org/3/search/movie?api_key=' + this.apiKey + '&query=' + searchInput;
      axios.get(infoUrl)
      .then((response) => {
        this.movieList = response.data.results;
        console.log(this.movieList);
      })
      .catch((error)=>{
        console.log(error)
      })
    },
    getPoster (key){
      if(this.movieList[key].poster_path != null){
        return 'https://image.tmdb.org/t/p/original' + this.movieList[key].poster_path
      }
      else return 'https://via.placeholder.com/500x750?text=Poster+Not+Available'
    }
  }
}
</script>
<style scoped>

.searchBox {
  max-width: 50%;
  margin: auto;
  margin-bottom: 50px;
}

.Info {
  color: black;
  font-family: "Tilt Warp";
  text-align: center;
  display: flex;
  flex-wrap: wrap;
}

.card {
  box-sizing: border-box;
  position: relative;
  margin: 0px 20px 20px 0px;
}

.card:hover {
  z-index: 1;
  transform: scale(1.3);
  transition: transform 0.3s ease-in-out;
  
}

.card .movie-title {
  font-size: 200px;
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  display: none;
  border-style: solid;
  border-color: transparent grey grey grey;
  border-radius: 0px 0px 16px 16px;
  color: black;
  background: white;
}

.card:hover .movie-title{
  display: block;
}


.Info img {
  width: 100%;
  height: 100%; 
  object-fit: cover;
}



</style>