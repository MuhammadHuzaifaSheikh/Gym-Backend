const Jim = require("../models/Jim.model");
const Packages = require("../models/Packages.model");
const Transaction = require("../models/Transaction.model");
const User = require("../models/User.model");
const { createError } = require("../utils/error");

const monthEarnings = async (req, res, next) => {
    try {
        const userData = req.user;
        const startDate = new Date();
        startDate.setDate(1);
        const endDate = new Date();

        // Initialize variables
        let totalEarning = 0;
        let totalExpense = 0;
        let monthlyEarning = 0;
        let monthlyExpense = 0;

        let user;
        if (req.query.GymId) {
            let gym = await Jim.findById(req.query.GymId)
            if (!gym) {
                return next(createError(404, "User not found"));

            }
            user = await User.findById(gym.Owner.toString());

        } else {
            user = await User.findById(userData.id);
        }

        if (!user) {
            return next(createError(404, "User not found"));
        }

        // Determine the filter based on user role
        let filter = {};

        if (user.isJimAdmin) {
            filter.type = "userPayment";
            filter.BusinessLocation = user.BusinessLocation[0].Gym;
        } else if (user.isAdmin) {
            filter.type = "jimPayment";
        } else {
            return next(createError(404, "Unauthorized to view earnings"));
        }

        // Retrieve all transactions for total earnings
        const transactionsForTotalEarning = await Transaction.find(filter);

        transactionsForTotalEarning.forEach((transaction) => {
            totalEarning += transaction.amount;
        });

        // Calculate total expenses and profit if user is admin
        if (user.isJimAdmin) {
            const transactionsForTotalExpense = await Transaction.find({
                user: user._id,
                type: "jimPayment"
            });

            transactionsForTotalExpense.forEach((transaction) => {
                totalExpense += transaction.amount;
            });
        }

        // Calculate monthly earnings
        const monthlyFilter = {
            date: { $gte: startDate, $lt: endDate }
        };

        if (user.isJimAdmin) {
            monthlyFilter.type = "userPayment";
            monthlyFilter.BusinessLocation = user.BusinessLocation[0].Gym;
        } else if (user.isAdmin) {
            monthlyFilter.type = "jimPayment";
        }

        const transactionsForMonthlyEarning = await Transaction.find(monthlyFilter);

        transactionsForMonthlyEarning.forEach((transaction) => {
            monthlyEarning += transaction.amount;
        });

        // Calculate monthly expenses and profit if user is admin
        if (user.isJimAdmin) {
            const transactionsForMonthlyExpense = await Transaction.find({
                user: user._id,
                type: "jimPayment",
                date: { $gte: startDate, $lt: endDate }
            });

            transactionsForMonthlyExpense.forEach((transaction) => {
                monthlyExpense += transaction.amount;
            });
        }

        // Calculate total and monthly profit
        const totalProfit = totalEarning - totalExpense;
        const monthlyProfit = monthlyEarning - monthlyExpense;

        // Prepare response data
        const results = {
            totalEarning: totalEarning,
            totalExpense: totalExpense,
            totalProfit: totalProfit,
            monthlyEarning: monthlyEarning,
            monthlyExpense: monthlyExpense,
            monthlyProfit: monthlyProfit
        };

        // Send success response with data
        return res.status(200).send({
            success: true,
            message: "Monthly earnings retrieved successfully",
            data: results
        });

    } catch (err) {
        // Handle any errors and pass them to the error handler middleware
        console.error("Error in monthEarnings:", err);
        return next(err);
    }
};
let getuserDashBoardData = async (req, res, next) => {
    try {
        const userData = req.user;
        const startDate = new Date();
        startDate.setDate(1);
        const endDate = new Date();

        let monthlyEarning = 0;
        let monthlyPending = 0
        let TotalPackages = 0
        // Find the user from database
        const user = await User.findById(userData.id);

        if (!user) {
            return next(createError(404, "User not found"));
        }

        // Calculate monthly earnings
        const monthlyFilter = {
            date: { $gte: startDate, $lt: endDate }
        };

        if (user.isJimAdmin) {
            monthlyFilter.type = "userPayment";
            monthlyFilter.BusinessLocation = user.BusinessLocation[0].Gym;
        } else if (user.isAdmin) {
            monthlyFilter.type = "jimPayment";
        }

        const transactionsForMonthlyEarning = await Transaction.find(monthlyFilter);

        transactionsForMonthlyEarning.forEach((transaction) => {
            monthlyEarning += transaction.amount;
        });
        if (user.isAdmin) {
            TotalPackages = 1
            let requests = await Jim.find({ status: "inactive" })
            newRequest = requests.length
        } else if (user.isJimAdmin) {
            let packages = await Packages.find({
                BusinessLocation: user.BusinessLocation[0].Gym
            })
            TotalPackages = packages.length

            const requests = await User.find({
                "BusinessLocation.Gym": user.BusinessLocation[0].Gym,
                "status": "inactive"
            });
            newRequest = requests.length

        }


        const results = {
            monthlyEarning: monthlyEarning,
            monthlyPending: monthlyPending,
            TotalPackages: TotalPackages,
            newRequest: newRequest
        };

        // Send success response with data
        return res.status(200).send({
            success: true,
            message: "Monthly earnings retrieved successfully",
            data: results
        });

    } catch (err) {
        // Handle any errors and pass them to the error handler middleware
        console.error("Error in monthEarnings:", err);
        return next(err);
    }
}

let AddTransaction = async (package, userId, BusinessLocation = null, next) => {
    try {
        if (!package || !userId) {
            return next(createError(404, "no data found"));
        }
        let packageDetail = await Packages.findOne({
            _id: package
        })

        let user = await User.findOne({
            _id: userId
        })

        if (!packageDetail || !user) {
            return next(createError(404, "no data found"));
        }
        let type;
        if (user.isJimAdmin) {
            type = "jimpaymet"
        } else if (!user.isJimAdmin && !user.isAdmin) {
            type = "userPayment"
        }
        let data = {
            user: userId,
            amount: packageDetail.price,
            BusinessLocation: BusinessLocation,
            type: type,
            date: new Date(),
            package: package,
        }

        const transaction = await new Transaction(data)
        await transaction.save()

        return transaction

    } catch (err) {
        return next(err);
    }

}

const GymwithLeastandMostUsers = async (req, res, next) => {
    try {
        // Find all users and populate the gyms they are associated with
        const users = await User.find().populate('BusinessLocation.Gym');

        // Create a map to track gym counts
        const gymCountMap = {};

        // Iterate through users to count gyms
        users.forEach(user => {
            if (user.BusinessLocation && user.BusinessLocation.length)
                user.BusinessLocation.forEach(gym => {
                    if (gym.Gym) {
                        const gymId = gym.Gym.toString();
                        if (!gymCountMap[gymId]) {
                            gymCountMap[gymId] = {
                                gym: gym,
                                count: 0
                            };
                        }
                        gymCountMap[gymId].count++;
                    }
                });
        });

        // Convert gymCountMap values to an array
        const gymsWithCounts = Object.values(gymCountMap);

        // Sort gyms by count (most users to least users)
        gymsWithCounts.sort((a, b) => b.count - a.count);

        // Get top 4 gyms with the most users
        const top4GymsWithMostUsers = gymsWithCounts.slice(0, 4);

        // Sort gyms by count (least users to most users)
        gymsWithCounts.sort((a, b) => a.count - b.count);

        // Get least 4 gyms with the least users
        const least4GymsWithLeastUsers = gymsWithCounts.slice(0, 4);

        res.status(200).json({
            most: top4GymsWithMostUsers,
            least: least4GymsWithLeastUsers
        });
    } catch (err) {
        return next(err);
    }
};




module.exports = {
    monthEarnings,
    AddTransaction,
    getuserDashBoardData,
    GymwithLeastandMostUsers
}