package com.kavithma.Tutionweb;

public class AdminDashboardStatsDTO {
    private long totalStudents;
    private double revenueThisMonth;
    private long totalEnrollments;
    private String mostPopularCourseName;
    private long mostPopularCourseEnrollments;

    public AdminDashboardStatsDTO(
            long totalStudents,
            double revenueThisMonth,
            long totalEnrollments,
            String mostPopularCourseName,
            long mostPopularCourseEnrollments
    ) {
        this.totalStudents = totalStudents;
        this.revenueThisMonth = revenueThisMonth;
        this.totalEnrollments = totalEnrollments;
        this.mostPopularCourseName = mostPopularCourseName;
        this.mostPopularCourseEnrollments = mostPopularCourseEnrollments;
    }

    public long getTotalStudents() {
        return totalStudents;
    }

    public double getRevenueThisMonth() {
        return revenueThisMonth;
    }

    public long getTotalEnrollments() {
        return totalEnrollments;
    }

    public String getMostPopularCourseName() {
        return mostPopularCourseName;
    }

    public long getMostPopularCourseEnrollments() {
        return mostPopularCourseEnrollments;
    }
}
