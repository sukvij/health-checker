package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	chatservice "github.com/sukvij/health-checker/backend/chat-service"
	healthreportservice "github.com/sukvij/health-checker/backend/health-report-service"
	"github.com/sukvij/health-checker/backend/healthfers/database"
	userservice "github.com/sukvij/health-checker/backend/user-service"
)

func main() {
	db, _ := database.Connection()
	app := gin.Default()
	app.Use(cors.Default())
	userservice.UserServiceRoute(app, db)
	healthreportservice.HealthReportServiceController(app, db)
	chatservice.HistroyRoute(app, db)
	app.Run(":8080")
}
