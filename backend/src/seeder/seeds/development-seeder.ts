import { Factory, Seeder } from 'typeorm-seeding';
import { User } from '../../users/entity/user.entity';
import { DataSource } from 'typeorm/data-source/DataSource';
import { Dish } from '../../dishes/entity/dish.entity';
import { Label } from '../../dishes/entity/label.entity';
import { DishType } from '../../dishes/entity/dish-type.entity';
import { UserDecisionTree } from '../../decisions/entity/user-decision-tree.entity';
import { Decision, UserDecision } from '../../decisions/entity/user-decision.entity';
import { Role } from '../../users/user-roles';

export default class DevelopmentSeeder implements Seeder {
  public async run(factory: Factory, connection: DataSource): Promise<any> {
    const userRepository = connection.getRepository(User);
    // check if data (user) already exist in database
    const userCount = await userRepository.count();
    // stop seeding if database is not empty, and you are in startup mode(docker compose up)
    if (process.env.IS_STARTUP && userCount > 0) {
      console.info('💡 Found data in database, skip seeding process!');
      return;
    }
    const labelRepository = connection.getRepository(Label);
    const dishTypeRepository = connection.getRepository(DishType);
    const dishesRepository = connection.getRepository(Dish);
    const decisionTreesRepository = connection.getRepository(UserDecisionTree);
    const decisionsRepository = connection.getRepository(UserDecision);

    // Labels
    await connection.query('TRUNCATE TABLE "label" RESTART IDENTITY CASCADE');
    const label_noDairy = labelRepository.create();
    label_noDairy.name = 'No Dairy';
    await label_noDairy.save();

    const label_noEgg = labelRepository.create();
    label_noEgg.name = 'No Eggs';
    await label_noEgg.save();

    const label_noFish = labelRepository.create();
    label_noFish.name = 'No Fish';
    await label_noFish.save();

    const label_noGluten = labelRepository.create();
    label_noGluten.name = 'No Gluten';
    await label_noGluten.save();

    const label_noMeat = labelRepository.create();
    label_noMeat.name = 'No Meat';
    await label_noMeat.save();

    // Types
    await connection.query('TRUNCATE TABLE "dish_type" RESTART IDENTITY CASCADE');
    const type_breakfast = dishTypeRepository.create();
    type_breakfast.name = 'Breakfast';
    await type_breakfast.save();

    const type_lunch = dishTypeRepository.create();
    type_lunch.name = 'Lunch';
    await type_lunch.save();

    const type_dinner = dishTypeRepository.create();
    type_dinner.name = 'Dinner';
    await type_dinner.save();

    const type_dessert = dishTypeRepository.create();
    type_dessert.name = 'Dessert';
    await type_dessert.save();

    // Users
    await connection.query('TRUNCATE TABLE "user" RESTART IDENTITY CASCADE');
    const admin = await userRepository.create({
      username: 'admin',
      email: 'admin@admin.de',
      password: 'admin',
      profileImagePath: 'public/img/users/sample_avatar.jpg',
      role: Role.Admin,
    });
    await admin.save();

    const user = await userRepository.create({
      username: 'user',
      email: 'user@user.de',
      password: 'user',
      profileImagePath: 'public/img/users/sample_avatar2.jpg',
      role: Role.User,
    });
    await user.save();

    const user2 = await userRepository.create({
      username: 'Emma',
      email: 'emma@web.de',
      password: 'emma',
      profileImagePath: 'public/img/users/sample_avatar3.jpg',
      role: Role.User,
    });
    await user2.save();

    // Dishes
    await connection.query('TRUNCATE TABLE "dish" RESTART IDENTITY CASCADE');
    const dish1 = await dishesRepository.create();
    dish1.name = 'Spaghetti Bolognese';
    dish1.imagePath = 'public/img/dishes/spaghetti_bolognese.jpg';
    dish1.user = admin;
    dish1.labels = [label_noFish];
    dish1.dishTypes = [type_lunch, type_dinner];
    await dish1.save();

    const dish2 = await dishesRepository.create();
    dish2.name = 'Lasagne';
    dish2.user = admin;
    dish2.imagePath = 'public/img/dishes/lasagne.jpg';
    dish2.labels = [label_noFish];
    dish2.dishTypes = [type_lunch, type_dinner];
    await dish2.save();

    const dish3 = await dishesRepository.create();
    dish3.name = 'Butter Chicken';
    dish3.user = admin;
    dish3.imagePath = 'public/img/dishes/butter_chicken.jpg';
    dish3.labels = [label_noEgg, label_noFish];
    dish3.dishTypes = [type_lunch, type_dinner];
    await dish3.save();

    const dish4 = await dishesRepository.create();
    dish4.name = 'Sushi';
    dish4.user = admin;
    dish4.imagePath = 'public/img/dishes/sushi.jpg';
    dish4.labels = [label_noDairy, label_noEgg, label_noGluten];
    dish4.dishTypes = [type_lunch, type_dinner];
    await dish4.save();

    const dish5 = await dishesRepository.create();
    dish5.name = 'Crispy Chicken Burger';
    dish5.user = admin;
    dish5.imagePath = 'public/img/dishes/crispy_chicken_burger.jpg';
    dish5.labels = [label_noFish];
    dish5.dishTypes = [type_lunch, type_dinner];
    await dish5.save();

    const dish6 = await dishesRepository.create();
    dish6.name = 'Potato Gratin';
    dish6.user = admin;
    dish6.imagePath = 'public/img/dishes/potato_gratin.jpg';
    dish6.labels = [label_noFish, label_noMeat, label_noGluten, label_noEgg];
    dish6.dishTypes = [type_lunch, type_dinner];
    await dish6.save();

    const dish7 = await dishesRepository.create();
    dish7.name = 'Spaghetti Carbonara';
    dish7.user = admin;
    dish7.imagePath = 'public/img/dishes/spaghetti_carbonara.jpg';
    dish7.labels = [label_noFish, label_noDairy];
    dish7.dishTypes = [type_lunch, type_dinner];
    await dish7.save();

    const dish8 = await dishesRepository.create();
    dish8.name = 'Tomato Soup';
    dish8.user = admin;
    dish8.imagePath = 'public/img/dishes/tomato_soup.jpg';
    dish8.labels = [label_noEgg, label_noFish, label_noGluten, label_noMeat];
    dish8.dishTypes = [type_lunch, type_dinner];
    await dish8.save();

    const dish9 = await dishesRepository.create();
    dish9.name = 'Pizza';
    dish9.user = admin;
    dish9.imagePath = 'public/img/dishes/pizza.jpg';
    dish9.labels = [label_noDairy, label_noEgg];
    dish9.dishTypes = [type_lunch, type_dinner];
    await dish9.save();

    const dish10 = await dishesRepository.create();
    dish10.name = 'Tortilla Wraps';
    dish10.user = admin;
    dish10.imagePath = 'public/img/dishes/wrap.jpg';
    dish10.labels = [label_noEgg];
    dish10.dishTypes = [type_lunch, type_dinner, type_breakfast];
    await dish10.save();

    const dish11 = await dishesRepository.create();
    dish11.name = 'Chocolate Ice Cream';
    dish11.user = admin;
    dish11.imagePath = 'public/img/dishes/chocolate_ice_cream.jpeg';
    dish11.labels = [label_noMeat, label_noFish, label_noGluten];
    dish11.dishTypes = [type_dessert];
    await dish11.save();

    const dish12 = await dishesRepository.create();
    dish12.name = 'Cheesecake';
    dish12.user = admin;
    dish12.imagePath = 'public/img/dishes/cheesecake.jpg';
    dish12.labels = [label_noMeat, label_noFish];
    dish12.dishTypes = [type_dessert];
    await dish12.save();

    const dish13 = await dishesRepository.create();
    dish13.name = 'Crème Brûlée';
    dish13.user = admin;
    dish13.imagePath = 'public/img/dishes/creme_brulee.jpg';
    dish13.labels = [label_noMeat, label_noFish, label_noGluten];
    dish13.dishTypes = [type_dessert];
    await dish13.save();

    const dish14 = await dishesRepository.create();
    dish14.name = 'Waffles';
    dish14.user = admin;
    dish14.imagePath = 'public/img/dishes/waffles.jpg';
    dish14.labels = [label_noMeat, label_noFish];
    dish14.dishTypes = [type_dessert, type_lunch];
    await dish14.save();

    const dish15 = await dishesRepository.create();
    dish15.name = 'German Quark Balls';
    dish15.user = admin;
    dish15.imagePath = 'public/img/dishes/german_quark_balls.jpg';
    dish15.labels = [label_noMeat, label_noFish];
    dish15.dishTypes = [type_dessert];
    await dish15.save();

    const dish16 = await dishesRepository.create();
    dish16.name = 'Apple Pie';
    dish16.user = admin;
    dish16.imagePath = 'public/img/dishes/apple-pie.jpg';
    dish16.labels = [label_noMeat, label_noFish];
    dish16.dishTypes = [type_dessert];
    await dish16.save();

    const dish17 = await dishesRepository.create();
    dish17.name = 'Mousse Au Chocolat';
    dish17.user = admin;
    dish17.imagePath = 'public/img/dishes/mousse-au-chocolat.jpg';
    dish17.labels = [label_noMeat, label_noFish, label_noGluten];
    dish17.dishTypes = [type_dessert];
    await dish17.save();

    const dish18 = await dishesRepository.create();
    dish18.name = 'Banana Bread';
    dish18.user = admin;
    dish18.imagePath = 'public/img/dishes/banana_bread.jpg';
    dish18.labels = [label_noMeat, label_noFish];
    dish18.dishTypes = [type_dessert];
    await dish18.save();

    const dish19 = await dishesRepository.create();
    dish19.name = 'Macarons';
    dish19.user = admin;
    dish19.imagePath = 'public/img/dishes/macarons.jpg';
    dish19.labels = [label_noMeat, label_noFish, label_noGluten];
    dish19.dishTypes = [type_dessert];
    await dish19.save();

    const dish20 = await dishesRepository.create();
    dish20.name = 'Chocolate Chip Cookies';
    dish20.user = admin;
    dish20.imagePath = 'public/img/dishes/chocolate_chip_cookies.jpg';
    dish20.labels = [label_noMeat, label_noFish];
    dish20.dishTypes = [type_dessert];
    await dish20.save();

    ////////// Lunch

    const dish21 = await dishesRepository.create();
    dish21.name = 'Spicy Ramen';
    dish21.imagePath = 'public/img/dishes/spicy_ramen.jpg';
    dish21.user = admin;
    dish21.labels = [label_noDairy];
    dish21.dishTypes = [type_lunch, type_dinner];
    await dish21.save();

    const dish22 = await dishesRepository.create();
    dish22.name = 'Caponata Flatbread';
    dish22.imagePath = 'public/img/dishes/caponata_flatbread.jpg';
    dish22.user = admin;
    dish22.labels = [label_noDairy];
    dish22.dishTypes = [type_lunch];
    await dish22.save();

    const dish23 = await dishesRepository.create();
    dish23.name = 'Greek Salad';
    dish23.imagePath = 'public/img/dishes/greek_salad.jpg';
    dish23.user = admin;
    dish23.labels = [label_noFish, label_noEgg, label_noMeat, label_noGluten];
    dish23.dishTypes = [type_lunch];
    await dish23.save();

    const dish24 = await dishesRepository.create();
    dish24.name = 'Black Bean Soup';
    dish24.imagePath = 'public/img/dishes/blackbean_soup.jpg';
    dish24.user = admin;
    dish24.labels = [label_noFish, label_noEgg, label_noMeat, label_noGluten];
    dish24.dishTypes = [type_lunch, type_dinner];
    await dish24.save();

    const dish25 = await dishesRepository.create();
    dish25.name = 'Pot Beef Curry';
    dish25.imagePath = 'public/img/dishes/pot_beef_curry.jpg';
    dish25.user = admin;
    dish25.labels = [label_noDairy, label_noFish, label_noEgg, label_noGluten];
    dish25.dishTypes = [type_lunch, type_dinner];
    await dish25.save();

    const dish26 = await dishesRepository.create();
    dish26.name = 'Salmon Niçoise Salad';
    dish26.imagePath = 'public/img/dishes/salmon_nicoise_salad.jpg';
    dish26.user = admin;
    dish26.labels = [label_noDairy, label_noGluten];
    dish26.dishTypes = [type_lunch];
    await dish26.save();

    const dish27 = await dishesRepository.create();
    dish27.name = 'Tomato Panzanella';
    dish27.imagePath = 'public/img/dishes/tomato_panzanella.png';
    dish27.user = admin;
    dish27.labels = [label_noEgg, label_noMeat, label_noFish];
    dish27.dishTypes = [type_lunch];
    await dish27.save();

    const dish28 = await dishesRepository.create();
    dish28.name = 'Grilled Chicken Pesto Sandwich';
    dish28.imagePath = 'public/img/dishes/grilled_chicken_pesto_sandwich.jpg';
    dish28.user = admin;
    dish28.labels = [label_noEgg, label_noFish];
    dish28.dishTypes = [type_lunch];
    await dish28.save();

    const dish29 = await dishesRepository.create();
    dish29.name = 'Egg Salad Sandwich';
    dish29.imagePath = 'public/img/dishes/egg_salad_sandwich.jpg';
    dish29.user = admin;
    dish29.labels = [label_noDairy, label_noFish, label_noMeat];
    dish29.dishTypes = [type_lunch];
    await dish29.save();

    const dish30 = await dishesRepository.create();
    dish30.name = 'Beef Phở';
    dish30.imagePath = 'public/img/dishes/beef_pho.jpg';
    dish30.user = admin;
    dish30.labels = [label_noDairy, label_noEgg, label_noFish];
    dish30.dishTypes = [type_breakfast, type_lunch, type_dinner];
    await dish30.save();

    const dish31 = await dishesRepository.create();
    dish31.name = 'Pad Thai';
    dish31.imagePath = 'public/img/dishes/pad_thai.jpg';
    dish31.user = admin;
    dish31.labels = [label_noDairy];
    dish31.dishTypes = [type_lunch, type_dinner];
    await dish31.save();

    ////////// Breakfast

    const dish32 = await dishesRepository.create();
    dish32.name = 'Pancakes';
    dish32.imagePath = 'public/img/dishes/pancakes.jpg';
    dish32.user = admin;
    dish32.labels = [label_noFish, label_noMeat];
    dish32.dishTypes = [type_breakfast, type_dessert];
    await dish32.save();

    const dish33 = await dishesRepository.create();
    dish33.name = 'Soft Scrambled Egg';
    dish33.imagePath = 'public/img/dishes/soft_scrambled_eggs.jpg';
    dish33.user = admin;
    dish33.labels = [label_noDairy, label_noGluten, label_noFish, label_noMeat];
    dish33.dishTypes = [type_breakfast];
    await dish33.save();

    const dish34 = await dishesRepository.create();
    dish34.name = 'Cereal';
    dish34.imagePath = 'public/img/dishes/cereal.jpg';
    dish34.user = admin;
    dish34.labels = [label_noEgg, label_noFish, label_noMeat];
    dish34.dishTypes = [type_breakfast];
    await dish34.save();

    const dish35 = await dishesRepository.create();
    dish35.name = 'French Toast';
    dish35.imagePath = 'public/img/dishes/french_toast.jpg';
    dish35.user = admin;
    dish35.labels = [label_noFish, label_noMeat];
    dish35.dishTypes = [type_breakfast, type_dessert];
    await dish35.save();

    const dish36 = await dishesRepository.create();
    dish36.name = 'Shakshuka';
    dish36.imagePath = 'public/img/dishes/shakshuka.jpg';
    dish36.user = admin;
    dish36.labels = [label_noDairy, label_noGluten, label_noFish];
    dish36.dishTypes = [type_breakfast];
    await dish36.save();

    const dish37 = await dishesRepository.create();
    dish37.name = 'Porridge';
    dish37.imagePath = 'public/img/dishes/porridge.jpg';
    dish37.user = admin;
    dish37.labels = [label_noEgg, label_noFish, label_noMeat];
    dish37.dishTypes = [type_breakfast];
    await dish37.save();

    const dish38 = await dishesRepository.create();
    dish38.name = 'Yogurt Bowl';
    dish38.imagePath = 'public/img/dishes/yogurt_bowl.jpg';
    dish38.user = admin;
    dish38.labels = [label_noEgg, label_noFish, label_noMeat, label_noGluten];
    dish38.dishTypes = [type_breakfast, type_dessert];
    await dish38.save();

    const dish39 = await dishesRepository.create();
    dish39.name = 'Croissant';
    dish39.imagePath = 'public/img/dishes/croissants.png';
    dish39.user = admin;
    dish39.labels = [label_noEgg, label_noFish, label_noMeat];
    dish39.dishTypes = [type_breakfast, type_dessert];
    await dish39.save();

    const dish40 = await dishesRepository.create();
    dish40.name = 'Chilaquiles';
    dish40.imagePath = 'public/img/dishes/chilaquiles.jpg';
    dish40.user = admin;
    dish40.labels = [];
    dish40.dishTypes = [type_breakfast];
    await dish40.save();

    const dish41 = await dishesRepository.create();
    dish41.name = 'Gallo Pinto';
    dish41.imagePath = 'public/img/dishes/gallo_pinto.jpg';
    dish41.user = admin;
    dish41.labels = [label_noGluten, label_noFish];
    dish41.dishTypes = [type_breakfast];
    await dish41.save();

    // Decision Tree
    await connection.query('TRUNCATE TABLE "user_decision_tree" RESTART IDENTITY CASCADE');
    const tree1 = decisionTreesRepository.create();
    tree1.size = 2;
    await tree1.save();

    // Decisions
    await connection.query('TRUNCATE TABLE "user_decision" RESTART IDENTITY CASCADE');
    const decision1 = decisionsRepository.create();
    decision1.treeId = tree1.id;
    decision1.position = 1;
    decision1.optionOne = dish5;
    decision1.optionTwo = dish4;
    decision1.decision = Decision.DECISION_TWO;
    await decision1.save();

    const decision2 = decisionsRepository.create();
    decision2.treeId = tree1.id;
    decision2.position = 2;
    decision2.optionOne = dish3;
    decision2.optionTwo = dish4;
    decision2.decision = Decision.DECISION_ONE;
    await decision2.save();
  }
}
