from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
import os

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
app.mount("/static", StaticFiles(directory=os.path.dirname(os.path.realpath(__file__)) + "\static"), name="static")

conn = psycopg2.connect(host='localhost', dbname='postgres', user='postgres', password='NewPassword',
                        port=5432)
cursor = conn.cursor()

global VOTE_COUNT_UPDATE
global VOTE_COUNT
global GENRE_VOTE_COUNT
global GENRE_VOTE_COUNT_CACHE
VOTE_COUNT_UPDATE = 0
GENRE_VOTE_COUNT = {'Adventure': 0,
 'Fantasy': 0,
 'Animation': 0,
 'Drama': 0,
 'Horror': 0,
 'Action': 0,
 'Comedy': 0,
 'History': 0,
 'Western': 0,
 'Thriller': 0,
 'Crime': 0,
 'Documentary': 0,
 'Science Fiction': 0,
 'Mystery': 0,
 'Music': 0,
 'Romance': 0,
 'Family': 0,
 'War': 0,
 'Foreign': 0,
 'TV Movie': 0}

@app.get('/revenue/year')
async def revenue_year():
    cursor.execute('select year, sum(revenue) from movie_management.movie group by year order by year')
    rows = cursor.fetchall()
    res_dict = {'year':[], 'revenue':[]}
    for i in range(0, len(rows), 5):
        res_dict['year'].append(rows[i][0])
        res_dict['revenue'].append(rows[i][1])
    return res_dict

@app.get('/revenue/month')
async def revenue_month():
    cursor.execute('select month, sum(revenue) from movie_management.movie group by month order by month')
    rows = cursor.fetchall()
    res_dict = {'month':[], 'revenue':[]}
    for i in range(0, len(rows)):
        res_dict['month'].append(rows[i][0])
        res_dict['revenue'].append(rows[i][1])
    return res_dict

@app.get('/revenue/day')
async def revenue_day():
    cursor.execute('select day, sum(revenue) from movie_management.movie group by day order by day')
    rows = cursor.fetchall()
    res_dict = {'day':[], 'revenue':[]}
    for i in range(0, len(rows)):
        res_dict['day'].append(rows[i][0])
        res_dict['revenue'].append(rows[i][1])
    return res_dict

@app.get('/vote_count/genre')
async def vote_count_genre():
    global GENRE_VOTE_COUNT
    global GENRE_VOTE_COUNT_CACHE
    cursor.execute(
        """
        select movie_management.genre.name,
	            tb1.vote_count
        from
        (select movie_management.genre_movie.genre_id as genre_id,
            sum(movie_management.movie.vote_count) as vote_count
        from movie_management.movie 
        inner join movie_management.genre_movie 
        on movie_management.movie.id = movie_management.genre_movie.movie_id
        group by movie_management.genre_movie.genre_id
        order by movie_management.genre_movie.genre_id) as tb1
        inner join movie_management.genre
        on movie_management.genre.id = tb1.genre_id

        """
    )
    rows = cursor.fetchall()
    res_dict = {'name':[], 'vote_count':[]}
    for i in range(0, len(rows)):
        res_dict['name'].append(rows[i][0])
        res_dict['vote_count'].append(rows[i][1] + GENRE_VOTE_COUNT[rows[i][0]])
    GENRE_VOTE_COUNT_CACHE = res_dict
    return res_dict

@app.get('/vote_count_cache/genre')
async def vote_count_cache_genre():
    global GENRE_VOTE_COUNT_CACHE
    return GENRE_VOTE_COUNT_CACHE

@app.get('/increase_vote_count/genre/{genre_name}')
async def increase_vote_count_genre(genre_name : str):
    global GENRE_VOTE_COUNT
    GENRE_VOTE_COUNT[genre_name] += 1
    return "increase successfully"

@app.get('/total_vote_count')
async def total_vote_count():
    global VOTE_COUNT_UPDATE
    global VOTE_COUNT
    cursor.execute('select sum(vote_count) from movie_management.movie')
    rows = cursor.fetchall()
    VOTE_COUNT = rows[0][0] + VOTE_COUNT_UPDATE
    return {'total_vote_count' : VOTE_COUNT}

@app.get('/total_vote_count_cache')
async def total_vote_count():
    global VOTE_COUNT
    return {'total_vote_count' : VOTE_COUNT}

@app.get('/increase_total_vote_count')
async def increase_total_vote_count():
    global VOTE_COUNT_UPDATE
    VOTE_COUNT_UPDATE += 1
    return 'Increase succesfully'

@app.get('/genres')
async def genres():
    cursor.execute('select * from movie_management.genre')
    rows = cursor.fetchall()
    res = []
    for i in range(0, len(rows)):
        res.append({'id':rows[i][0], 'name':rows[i][1]})
    return {'genres' : res}
