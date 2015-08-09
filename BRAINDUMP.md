# App BrianDump

### Level 1

Example: a linear regression model.   
We have data points, and looking at the data, we chose a linear model. This
linear model interacts with two parameters: the slope and the b. 
Different models influences the nature of the parameters. 

-> Single-objective function. 

**[[ Step 1: Select Energy System ]]**  

- Creates a backbone model for the system
- creates a basic vector function

**[[ Step 2: Input params ]]**  

Case 1: user knows the value and provides the value
Case 2: user knows a possible range and provides the values
Case 3: user leaves empty parameters -> then this becomes another component of the optimization. (multi-objective case).
Case 4: ignore this param. (value can be chosen randomly). We can use __getattr__ in python for this.  
- User can input param values, ranges, and can leave blank
- This gives the vector function which we will work on. 
- these functions are my models and that is what makes my parameters intereact this way. 
- one thing that we can calculate is the turbine geo-allocation. Different curves are different configurations?
- Want the optimal network configuration. 
- Choose offset in X years. If we want to maximize the value of offset, be as close to 100% as possible, that is case scenario that the user fixes. From there it is a classic optimization problem. If objective is fixed at 40 years, a single-objective function, and then the parameters where we change the values to get close to the offset is the geo-position, number of turbines, etc.     

Consider the case where the user does not know which parameters to input, maybe some params are not that important after all, or maybe it is imprecise. Maybe wants to know what happens for several values for a parameter. Then, maybe after seeing what happens, it that case he will go and fix a model and we go to mult-objective funtions. It is not true that for all users these parameters are as important or are known in advanced. Maybe this can help study this parameters. In this case, we need to develop a clear specification of what are parameters of the economic model, classic optimzation parameters of the model, the objective, then the code should be able to assign different weights to the parameters 

Code must be modular and flexible in case we add another objective. I should have the possibility of leaving
one of the parameters empty to be an objective to be optimized. Example: we want to max this and min that.  

The difference between evaluating a range instead of passing a single constant value to one of the parameters has to do with the history of the pareto optimal. We want to max/min this objective, but not in an absolute way because 
I have another objective. This is where the multi-objective comes into play. 

We can work on subadjecents models. In a system of several equations, we can choose to work on X,Y,Z, but we can also decide to work on A,B,C. And this changes the mathematical object in question. We change the point of view of the problem. If we are capable of making a subadjacent model (a meta-model) which is flexible so that we can later while fixing parameters to produce our model optimized, then we can test everything! Brute-force is a subadjacent code case. Have the meta-model and from the POV that the user brings, we can fix the model to be optimized.  

**[[ Step 3: Create Economic Model ]]**

- the algorithm (can be a classic algorithm) or a combination of two classic
algorithms will play with the parameters to try to find the network configuration
The combination of this parameters make this configuation the best possible configuration. Here my structure is fixed. 

- The parameters tell us the model.  
  - here we optimize!

### Level 2 

**[[ Step 4: Meta-Heuristics ]]**  

- Here we dive into the adaptable networks. It changes while it is learning. Can add new links. It will tell us how to change parameters. Example: add a new node.
- The model tell us the parameters. It works backwards.     
- Show results
- Propositions 

- we get into multi-objective functions!
