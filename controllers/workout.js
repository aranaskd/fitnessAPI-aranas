const Workout = require("../models/Workout");

module.exports.addWorkout = (req, res) => {

    const userId = req.user.id;
    const { name, duration } = req.body;
    
    let addWorkout = new Workout({
        userId,
        name,
        duration
    })

    return addWorkout.save()
    .then(() => {
        return res.status(201).json(addWorkout);
    })
    .catch (error => {
        return res.status(500).json({
            message: 'An error occurred while saving the cart.', 
            error: error.message 
        })
    })
                
}

module.exports.getMyWorkouts = (req, res) => {

    const userId = req.user.id;

    return Workout.find({ userId })
    .then(workout => {

        if(workout.length === 0) {
            return res.status(404).json({ message: 'No workout found for this user.' });
        }

        return res.status(200).json({ workouts: workout })

    }).catch (error =>  {
        return res.status(500).json({ 
            message: 'An error occurred while retriving workouts.', 
            error: error.message 
        });
    })
    
}

module.exports.updateWorkout = (req, res) => {

    const userId = req.user.id;
    const { name, duration } = req.body; 
    const { workoutId } = req.params;

    let updatedWorkout = {
        userId,
        name,
        duration
    }

    return Workout.findByIdAndUpdate({ userId, _id: workoutId }, updatedWorkout, {new: true, runValidators: true})
    .then(workout => {
        if(workout) {
            return res.status(200).json({ message: 'Workout updated successfully', updatedWorkout: workout });
        }

        return res.status(404).json({ error: 'Workout not found' });
    })
    .catch (error =>  {
        return res.status(500).json({ 
            message: 'An error occurred while retriving workouts.', 
            error: error.message 
        });
    })
    
}

module.exports.deleteWorkout = (req, res) => {

    const userId = req.user.id;
    const { workoutId } = req.params;

    return Workout.findByIdAndDelete({userId, _id: workoutId})
    .then(deletedWorkout => {
        if (deletedWorkout) {
            return res.status(200).json({ message: 'Workout delete successfully' });
        }

        return res.status(404).json({ error: 'Workout not found' });
    })
    .catch (error =>  {
        return res.status(500).json({ 
            message: 'An error occurred while deleting workouts.', 
            error: error.message 
        });
    })
    
}

module.exports.completeWorkoutStatus = (req, res) => {

    const userId = req.user.id;
    const { workoutId } = req.params;

    let changeStatus = {
        status: 'complete'
    }

    return Workout.findByIdAndUpdate({ userId, _id: workoutId }, changeStatus, {new: true, runValidators: true})
    .then(status => {
        if(status) {
            return res.status(200).json({
                message: 'Workout status updated successfully',
                updatedWorkout: status
            })
        } 

        return res.status(404).json({ error: 'Workout not found' });
    })
    .catch (error =>  {
        return res.status(500).json({ 
            message: 'An error occurred while updating workouts status.', 
            error: error.message 
        });
    })
    
}