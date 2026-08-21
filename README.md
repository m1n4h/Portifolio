<div align="center">
    <a href="https://londonappdeveloper.com" target="_blank">
        <img src="https://londonappdeveloper.com/wp-content/uploads/2024/11/banner.svg" alt="Banner image" />
    </a>
</div>

<div align="center">
    <p>Full-Stack Consulting and Courses.</p>
    <a href="https://londonappdeveloper.com" target="_blank">Website</a> |
    <a href="https://londonappdeveloper.teachable.com/" target="_blank">Courses</a> |
    <a href="https://londonappdeveloper.com/tutorials/" target="_blank">Tutorials</a> |
    <a href="https://londonappdeveloper.com/consulting/" target="_blank">Consulting
</div>

<br /><br >

# How to Dockerize a React Project

Tutorial code for dockerizing a react project.

 * [YouTube](https://youtu.be/v6SMDB3Sr2M)
 * [Tutorial](https://londonappdeveloper.com/how-to-dockerize-a-react-project/)

clone the project

git clone https://github.com/aminakalonge/portfolio.git
cd amina-kalonge-portfolio


create the  environment files
cp .env.template .env
# Edit .env with your configuration


Build and start containers
docker-compose up --build

# Run database migrations
docker-compose exec backend python3 manage.py migrate

# Collect static files
python3 manage.py collectstatic
# Create superuser (optional)
docker-compose exec backend python3 manage.py createsuperuser




# Access the application
Frontend: http://localhost:5173

Backend API: http://localhost:8000/api

Django Admin: http://localhost:8000/admin


# After Successful Setup
Once migrations are applied and the server is running:

Admin Panel: http://localhost:8000/admin/ - Login with your superuser credentials

API Endpoints:

http://localhost:8000/api/projects/

http://localhost:8000/api/skills/

http://localhost:8000/api/contact/


# Backend Setup

cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py runserver





# Frontend Setup

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Install dependencies
npm install



# Docker Commands
# Start services
docker-compose up

# Start in background
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild containers
docker-compose build --no-cache

# Run specific service
docker-compose up frontend
docker-compose up backend


# for kuangalizia
https://nidnasser.me/about

python manage.py runserver
npm run dev
docker compose up



Admin user created successfully!
Username: admin
Email: portfoliosalvier@gmail.com
Default password: Admin@123